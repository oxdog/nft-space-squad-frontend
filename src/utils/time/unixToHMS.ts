export const unixToHMS = (unix: number) => {
  let hours = Math.floor(unix / (1000 * 60 * 60))
  let mins = Math.floor(unix / (1000 * 60)) - hours * 1000 * 60 * 60
  let sec = Math.floor(unix / 1000) - mins * 60 - hours * 60 * 60

  return `${hours}h ${mins}m ${sec}s`
}
