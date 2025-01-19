export class MaxNumbersOfCheckInsError extends Error {
  constructor() {
    super('Max number of check-ins reached.')
  }
}
