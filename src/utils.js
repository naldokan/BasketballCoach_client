export const Round = val => Math.round(val * 100) / 100

export const accuracyColor = accuracy => {
    return accuracy >= 90 ? '#188e28'
    : accuracy >=75 ? '#e0ab26'
    : accuracy >= 50 ? '#e05d25'
    : '#960000'
}
