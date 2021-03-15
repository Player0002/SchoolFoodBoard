import React from 'react';
const percentColors = [
    { pct: 0.0, color: { r: 0xd8, g: 0x54, b: 0x54 } },
    { pct: 99.0, color: { r: 0x4B, g: 0x72, b: 0xA6 } },
    { pct: 100.0, color: { r: 0x4B, g: 0x72, b: 0xA6 } } ];

const getColorForPercentage = (pct) => {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

function getDifference(currentMillis) {
    let diff = Math.round(currentMillis / 1000)
    const result = {
        day: 0,
        hour: 0,
        min: 0,
        sec: 0,
    }
    if (diff >= 3600 * 24) {
        result.day = Math.floor(diff / (3600 * 24));
        diff -= result.day * 3600 * 24;
    }
    if (diff >= 3600) {
        result.hour = Math.floor(diff / 3600)
        diff -= result.hour * 3600
    }
    if (diff >= 60) {
        result.min = Math.floor(diff / 60)
        diff -= result.min * 60
    }
    result.sec = diff
    return result
}

const PercentBar = (props) => {

    const inDate = props.inTime
    const outDate = props.outTime

    const fullTime = outDate - inDate
    const leftTime = outDate - props.nowTime
    const nowTime = props.nowTime - inDate

    const calculated = getDifference(leftTime)

    const percentage = (nowTime / fullTime) * 100;

    return (
        <div className="percentageBar">
            <div className="percentage">
                <h2>집가기까지 남은시간</h2>
                <h3>{ `${calculated.day > 0 ? (calculated.day + '일 ') : ''}${calculated.hour}시간 ${calculated.min}분 ${calculated.sec}초` }</h3>
            </div>
            <div className="backgroundBar">
                <div className="innerBar" style={{ width: `${percentage}%`, background: `${getColorForPercentage(percentage)}`}}>
                </div>
                <span>{ Math.floor(percentage)} %</span>
            </div>
        </div>
    )
}

export default PercentBar