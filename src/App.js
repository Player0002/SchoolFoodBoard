import logo from "./logo.svg";
import React, { useEffect, useState } from "react";
import "./App.css";
import PercentBar from "./component/percentBar";
import { useInterval } from "react-use";
import moment from "moment";
import MealTable from "./component/mealTable";
import duck from "./images/duck.png";
import bear from "./images/bear.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const dates = ["일", "월", "화", "수", "목", "금", "토"];
function App() {
  const [currentTime, setCurrentTime] = useState(moment());
  const [inTime, setInTime] = useState(new Date());
  const [outTime, setOutTime] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setInTime(start);
    setOutTime(end);
  };

  useInterval(() => {
    setCurrentTime(moment());
  }, 1000);

  return (
    <div className="App">
      <h1>
        {currentTime.format("YYYY년 MM월 DD일 ").toString() +
          `(${dates[currentTime.day()]})`}
      </h1>
      <PercentBar
        nowTime={currentTime}
        inTime={moment(inTime)}
        outTime={moment(outTime)}
      ></PercentBar>
      <MealTable nowTime={currentTime}></MealTable>
      <img
        src={currentTime.hour() % 2 == 0 ? bear : duck}
        style={{
          marginLeft: `-100px`,
          marginTop: `2rem`,
          marginBottom: `3rem`,
        }}
      ></img>
      <div>
        <h5>기숙사 입소시간을 선택하세요</h5>
        <DatePicker
          selected={inTime}
          onChange={date => setInTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <h5>기숙사 퇴소시간을 선택하세요</h5>
        <DatePicker
          selected={outTime}
          onChange={date => setOutTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
    </div>
  );
}

export default App;
