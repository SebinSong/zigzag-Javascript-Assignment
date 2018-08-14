/*
시간 패턴 예)
 sat 07:00~18:00
 mon,tue,fri 12:00~15:00, 18:00~21:00
 mon,tue 12:00~15:00, 18:00~21:00 fri 13:00~19:20
*/

const UNIT_HR = 1/24;
const UNIT_MIN = UNIT_HR/60;

function patternToRange(timeStr){
  // ex. "fri 12:00~15:00" -> [4.5, 4.625]

  const map = {
    'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4, 'sat': 5, 'sun': 6
  };

  const regExp = /([a-z]{3})\s([0-9]{2}):([0-9]{2})\~([0-9]{2}):([0-9]{2})/;

  let day = null, hr1 = null, min1 = null, hr2 = null, min2 = null;
  let matchArr = timeStr.match(regExp).slice(1);

  day = map[ matchArr[0] ];
  hr1 = parseInt(matchArr[1], 10) * UNIT_HR;
  min1 = parseInt(matchArr[2], 10) * UNIT_MIN;
  hr2 = parseInt(matchArr[3], 10) * UNIT_HR;
  min2 = parseInt(matchArr[4], 10) * UNIT_MIN;

  return [day+hr1+min1, day+hr2+min2];
}

function timePatternTotimeSubPatterns(timeStr){
  /* ex.
  	mon,tue,thu 12:00~15:00, 18:00~21:00, fri 14:00~20:00
    ->
    [
    	mon,tue,thu 12:00~15:00, 18:00~21:00,
        fri 14:00~20:00
    ]
  */

  const regExp_day = /([a-z]{3}\,?)+/;
  const regExp_time = /([0-9]{2}\:[0-9]{2}\~[0-9]{2}\:[0-9]{2}\,?\s?)+/;
  const subStrArr = [];


  while(timeStr !== ""){
    let subStr = "";

    subStr += timeStr.match(regExp_day)[0];
    timeStr = timeStr.replace(regExp_day, "");
    subStr += ` ${timeStr.match(regExp_time)[0]}`;
    timeStr = timeStr.replace(regExp_time, "");
    subStr = subStr.replace(/\,\s$/, "");

    subStrArr.push(subStr);
    timeStr = timeStr.trim();
  }

  return subStrArr;
}

function timeStrToPatternArray(timeStr){
  /* ex.
  mon,tue,fri 12:00~15:00, 18:00~21:00
    ->
  [
    "mon 12:00~15:00", "mon 18:00~21:00", "tue 12:00~15:00",
    "tue 18:00~21:00", "fri 12:00~15:00", "fri 18:00~21:00"
  ]
  */

  let dayArr, timeRangeArr, patternArr = [];

  const regExp_day = /[a-z]{3}/g;
  const regExp_time = /[0-9]{2}\:[0-9]{2}\~[0-9]{2}\:[0-9]{2}/g;

  dayArr = timeStr.match(regExp_day);
  timeRangeArr = timeStr.match(regExp_time);

  dayArr.forEach( day => {
      timeRangeArr.forEach( timeRange => {
        patternArr.push(`${day} ${timeRange}`);
      });
  });

  return patternArr;
}

function getCurrentTimePoint(){
  // 현재 시간을 0-7 사이의 수평선 위의 한 점으로 계산 후 리턴
  let day, hr, min;
  const now = new Date();

  day = now.getDay() - 1;
  if(day === -1) day = 6;
  hr = now.getHours();
  min = now.getMinutes();

  return day + hr*UNIT_HR + min*UNIT_MIN;
}

function getGivenTimePoint(givenTime){
  // 주어진 시각을 0-7 사이의 수평선 위의 한 점으로 계산 후 리턴
  const map = {
    'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4, 'sat': 5, 'sun': 6
  };
  const regExp_time = /([0-9]{2})/g, regExp_day = /[a-z]{3}/;
  let day, hr, min;

  day = map[ givenTime.match(regExp_day)[0] ];

  givenTime.match(regExp_time).forEach( (item, index) => {
  	if(index == 0) hr = parseInt(item, 10) * UNIT_HR;
    else min = parseInt(item, 10) * UNIT_MIN;
  });

  return day + hr + min;
}

function isInGivenRanges(point, ranges){
  // point가 배열로 전달된 범위들(ranges) 내부에 위치하는 값이냐 아니냐를 판별
  return ranges.some(
    range => range[0] <= point && point <= range[1]
  );
}

// givenTime 매개변수(검사를 원하는 특정시점)가 있으면 그걸 쓰고, 없으면
// 현재 시점을 이용해 검사를 진행한다.

function isAvailableTime(timePattern, givenTime){

  let timeRanges, timePoint, timeSubPatterns, patternArray = [];

  // step 1) timePattern to timeSubPatterns
  timeSubPatterns = timePatternTotimeSubPatterns(timePattern);

  // step 2) timeSubPatterns to patternArray
  timeSubPatterns.forEach( timeSubPattern => {
    patternArray = patternArray.concat(timeStrToPatternArray(timeSubPattern));
  });

  // step 3) patternArray to timeRanges
  timeRanges = patternArray.map(patternToRange);

  // step 4) get the point of time to be examined
  timePoint = (givenTime)? getGivenTimePoint(givenTime) : getCurrentTimePoint();

  // step 5) examine whether the point of time is in the given time ranges
  return isInGivenRanges(timePoint, timeRanges);
}


function test(){

  console.log(
    "test-1 기대값: false, 실제값: ",
    isAvailableTime(
      "mon,tue 12:00~15:00, 18:00~21:00",
      "fri 13:00")
  );

  console.log(
    "test-2 기대값: true, 실제값: ",
    isAvailableTime(
      "wed 00:00~24:00",
      "wed 08:30")
  );

  console.log(
    "test-3 기대값: depends when it runs, 실제값: ",
    isAvailableTime(
      "wed, fri 00:15~24:30")
  );

  console.log(
    "test-4 기대값: depends when it runs, 실제값: ",
    isAvailableTime(
      "tue,wed,sun 07:00~10:20, 15:00~18:33")
  );

  console.log(
    "test-5 기대값: true, 실제값: ",
    isAvailableTime(
      "fri,sat,sun 07:00~10:00, 15:00~18:00",
      "sat 18:25")
  );
}
