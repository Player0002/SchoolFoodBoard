import moment from "moment"

const inDate = moment.parseZone('2021-03-01T18:30:00+09:00'); //학교 온 시간
const outDate = moment.parseZone('2021-03-24T10:00:00+09:00'); //집 가는 시간

export { inDate, outDate }