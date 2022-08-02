import moment from 'moment'

// date something like '2022-04-02T15:30:00'
export const getTimeUntilUTCDate = (date: string) => {
  var dur = moment.duration(moment.utc(date).diff(moment()))

  return [
    dur.years(),
    dur.months(),
    dur.days(),
    dur.hours(),
    dur.minutes(),
    dur.seconds(),
  ]
}
