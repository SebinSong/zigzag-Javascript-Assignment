function alterDateFormat(timeStr, N){

  const currentTime = {
    hr: null, min: null, sec: null
  }
  const newTime = {
    hr: null, min: null, sec: null
  }

  // ----------- Implementation Part ----------

  calculateCurrentTime();
  addPassedTime();

  return stringifyTime();

  // ------------------------------------------


  /*
  *
    Inner Functions
    - alterDateFormat() 함수에 쓰이는 여러가지 Helper function들을 정의하는 부분
  *
  */

  function calculateCurrentTime(){
  // This function calculates each hr, min, sec of the current time(Time passed as a parameter)
  // and store them in currentTime object

    let pmam, arr;

    pmam = timeStr.match(/^[A-Z]{2}/)[0];

    timeStr.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/)
    .forEach( (piece, i) => {

       let num = parseInt(piece, 10);

       switch(i){
         case 1: currentTime.hr = num; break;
         case 2: currentTime.min = num; break;
         case 3: currentTime.sec = num; break;
       }
    });

    if(pmam === "PM") currentTime.hr += 12;

  }

  function addPassedTime(){
  // This function adds N to the currentTime

    const toBeAdded = {
      hr: null, min: null, sec: null
    }

    let temp = N;

    // hr calculation
    toBeAdded.hr = Math.floor(temp/3600);
    temp = temp%3600;
    // mins caclulation
    toBeAdded.min = Math.floor(temp/60);
    temp = temp%60;
    // secs calculation
    toBeAdded.sec = temp;


    // newTime object = currentTime object + toBeAdded object
    for( let key in toBeAdded ){
      newTime[key] = currentTime[key] + toBeAdded[key];
    }

    if(newTime.sec>=60){
      newTime.sec -= 60;
      newTime.min++;
    }
    if(newTime.min>=60){
      newTime.min -= 60;
      newTime.hr++;
    }
    if(newTime.hr >=24){
      newTime.hr = newTime.hr%24;
    }

  }

  function stringifyTime(){
    // transform newTime object into a string form

    function transform(num){
       let str = num.toString(10);
       return (str.length < 2)? "0" + str : str;
    }

    return `${transform(newTime.hr)}:${transform(newTime.min)}:${transform(newTime.sec)}`;
  }


} // alterDateFormat() end


// 테스트 코드 , test()로 실행.
function test(){

  console.log("test-1: ", alterDateFormat("PM 01:00:00", 10) === "13:00:10");
  console.log("test-2: ", alterDateFormat("PM 11:59:59", 1) === "00:00:00");
  console.log("test-3: ", alterDateFormat("AM 12:10:00", 40) === "12:10:40");
  console.log("test-4: ", alterDateFormat("PM 08:00:00", 3600) === "21:00:00");
  console.log("test-5: ", alterDateFormat("AM 05:24:03", 102392) === "09:50:35");
  console.log("test-6: ", alterDateFormat("AM 05:24:03", 200000) === "12:57:23");

}








/*
  좀 더 Deep하게 테스트 하는 함수를 한번 임의로 만들어 보았습니다.
  test_deep()으로 실행하시면 됩니다.
*/


function testEach(callback, ...args){

  const result = callback.apply(null, args);
  const regExp = /([0-9]{2})\:([0-9]{2})\:([0-9]{2})/;

  if(result.length !== 8) throw new Error("the result must be a string with the length of 8.");
  if(regExp.test(result)){

    const [ hr, min, sec ] = [...result.match(regExp).slice(1)];

    if(parseInt(hr, 10) >= 24) throw new Error("the hour value is wrong: ", hr);
    if(parseInt(min, 10) >= 60) throw new Error("the minute value is wrong: ", min);
    if(parseInt(sec, 10) >= 60) throw new Error("the second value is wrong: ", sec);
  }
  else throw new Error("the format of the function call result is wrong.");

  console.log(`everything is fine with the function call result. the result: ${result}`);
}

function test_deep(){

  try {
    console.log("--- test-1 ---");
    testEach(alterDateFormat, "PM 01:00:00", 10);
  } catch( err ){
    console.log("test-1 error: ", err);
  }

  try {
    console.log("--- test-2 ---");
    testEach(alterDateFormat, "PM 11:59:59", 1);
  } catch( err ){
    console.log("test-2 error: ", err);
  }

  try {
    console.log("--- test-3 ---");
    testEach(alterDateFormat, "AM 12:10:00", 40);
  } catch( err ){
    console.log("test-3 error: ", err);
  }

  try {
    console.log("--- test-4 ---");
    testEach(alterDateFormat, "PM 01:00:00", 10);
  } catch( err ){
    console.log("test-4 error: ", err);
  }

  try {
    console.log("--- test-5 ---");
    testEach(alterDateFormat, "AM 05:24:03", 102392);
  } catch( err ){
    console.log("test-5 error: ", err);
  }

  try {
    console.log("--- test-6 ---");
    testEach(alterDateFormat, "AM 05:24:03", 200000);
  } catch( err ){
    console.log("test-6 error: ", err);
  }

}
