import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";
import axios from "axios";
import "swiper/swiper.scss";
import "swiper/components/effect-fade/effect-fade.scss";
import "swiper/components/effect-cube/effect-cube.scss";
import "swiper/components/effect-flip/effect-flip.scss";
import "./mealTable.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SwiperCore, { Autoplay, EffectFlip } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { redColorTrans, blueColorTrans, redColor, blueColor} from "../config/colors";

const nextDayStyle = {
  border: `0.5rem dashed ${redColorTrans}`,
};

const todayStyle = {
  border: `0.5rem dashed ${blueColorTrans}`,
};

const serverUrl =
  "https://kyj-school-server.herokuapp.com/meal?AD_CODE=D10&SC_CODE=7240454";

const loadingFood = {
  breakfast: { lists: "급식을 불러오는중입니다" },
  lunch: { lists: "급식을 불러오는중입니다" },
  dinner: { lists: "급식을 불러오는중입니다" },
};

const noFood = {
  lists: "급식이 없습니다",
};

const MealTable = (props) => {
  const [mealInfo, setMealInfo] = useState(new Map());

  const updateMealInfo = (key, value) => {
    setMealInfo(new Map(mealInfo.set(key, value)));
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const updateData = async (time) => {
    const formated = time.format("YYYYMMDD").toString();
    if (mealInfo.get(formated) === undefined) {
      //required data loading
      let map = new Map();
      const added = time.clone().add("days", 1);
      map.set(formated, loadingFood);
      map.set(added.format("YYYYMMDD").toString(), loadingFood);
      updateMealInfo(formated, loadingFood);
      const result = await axios.get(
        `${serverUrl}&START=${time.valueOf()}&END=${added.valueOf()}`,
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
      for (let data in result.data.result) {
        const resultInfo = result.data.result[data];
        console.log(resultInfo.date);
        map.set(
          resultInfo.date.toString(),
          resultInfo || { breakfast: noFood, lunch: noFood, dinner: noFood }
        );
      }
      setMealInfo(map);
      console.log("use network");
    } else {
      console.log("Use cache");
    }
  };
  useEffect(() => {
    updateData(props.nowTime);
    updateData(props.nowTime.add("days", 1));
  }, []);
  useInterval(() => {
    updateData(props.nowTime);
    updateData(props.nowTime.add("days", 1));
  }, 10000);

  const today = props.nowTime.format("YYYYMMDD").toString();
  const nextDay = props.nowTime
    .clone()
    .add("days", 1)
    .format("YYYYMMDD")
    .toString();
  console.log(` ${today} / ${nextDay} `);
  const breakfast =
    (props.nowTime.hour() > 7
      ? mealInfo.get(nextDay)?.breakfast
      : mealInfo.get(today)?.breakfast) || noFood;
  const lnch =
    (props.nowTime.hour() > 13
      ? mealInfo.get(nextDay)?.lunch
      : mealInfo.get(today)?.lunch) || noFood;
  const din =
    (props.nowTime.hour() > 19
      ? mealInfo.get(nextDay)?.dinner
      : mealInfo.get(today)?.dinner) || noFood;

  let breakfastStr = breakfast?.lists?.replace(/<br\/>/g, "\n");
  let lnchStr = lnch?.lists?.replace(/<br\/>/g, "\n");
  let dinStr = din?.lists?.replace(/<br\/>/g, "\n");

  SwiperCore.use([Autoplay, EffectFlip]);
  const kcal =
    currentIndex == 0
      ? breakfast?.cal?.split(" ")[0]
      : currentIndex == 1
      ? lnch?.cal?.split(" ")[0]
      : din?.cal?.split(" ")[0];

  const isNextDay =
    (currentIndex == 0 && props.nowTime.hour() > 7) ||
    (currentIndex == 1 && props.nowTime.hour() > 13) ||
    (currentIndex == 2 && props.nowTime.hour() > 19);

  return (
    <div>
      <div className="progress">
        <CircularProgressbar
          value={kcal === undefined ? 0 : kcal}
          maxValue={2400}
          text={`${kcal === undefined ? 0 : Math.floor(kcal)} kcal`}
          styles={buildStyles({
            textSize: "0.8rem",
            trailColor: `#707070`,
            textColor: "white",
            pathColor: `${isNextDay ? redColor: blueColor}`,
          })}
        />
      </div>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="flip"
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.realIndex);
        }}
      >
        <SwiperSlide>
          <div className="mealInfo">
            <div
              className="table"
              style={props.nowTime.hour() > 7 ? nextDayStyle : todayStyle}
            >
              <div>
                <p>아침</p>
                <pre>{breakfastStr || noFood.lists}</pre>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="mealInfo">
            <div
              className="table"
              style={props.nowTime.hour() > 13 ? nextDayStyle : todayStyle}
            >
              <div>
                <p>점심</p>
                <pre>{lnchStr || noFood.lists}</pre>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="mealInfo">
            <div
              className="table"
              style={props.nowTime.hour() > 19 ? nextDayStyle : todayStyle}
            >
              <div>
                <p>저녁</p>
                <pre>{dinStr || noFood.lists}</pre>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div>
        <h4 style={{
          color: `${isNextDay ? redColor : blueColor}`
        } }>{ isNextDay ? "붉은색은 다음날 급식을 나타냅니다." : "파란색은 오늘의 급식을 나타냅니다."}</h4>
      </div>
    </div>
  );
};

export default MealTable;
