import path from 'node:path'
import swc, { type JscConfig, type JscTarget } from '@swc/core'
import { defineConfig } from 'tsup'

import tsConfig from './tsconfig.json'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/@types',
    '!src/**/*.{test,spec}.ts',
    '!src/**/*.interface.ts',
  ],
  target: 'node22',
  clean: true,
  minify: true,
  outDir: './build',
  sourcemap: true,
  bundle: false,
  esbuildPlugins: [
    {
      name: 'override-swc',
      setup(build) {
        // Original Source: https://github.com/egoist/tsup/blob/49c11c3073ce977a01c84e7848fc070d5de0a652/src/esbuild/swc.ts#L14-L67
        build.onLoad({ filter: /\.[jt]s$/ }, async args => {
          const isTs = /\.ts$/.test(args.path)
          const jsc: JscConfig = {
            parser: {
              syntax: isTs ? 'typescript' : 'ecmascript',
            },
            baseUrl: path.resolve(__dirname, tsConfig.compilerOptions.baseUrl || '.'),
            paths: tsConfig.compilerOptions.paths,
            target: 'es2022' as JscTarget,
          }
          const result = await swc.transformFile(args.path, {
            jsc,
            sourceMaps: true,
            configFile: false,
            swcrc: false,
          })
          let code: string = result.code
          if (result.map) {
            const map: { sources: string[] } = JSON.parse(result.map)
            // Make sure sources are relative path
            map.sources = map.sources.map(source => {
              return path.isAbsolute(source)
                ? path.relative(path.dirname(args.path), source)
                : source
            })
            code += `//# sourceMappingURL=data:application/json;base64,${Buffer.from(
              JSON.stringify(map),
            ).toString('base64')}`
          }
          return {
            contents: code,
          }
        })
      },
    },
  ],
})
