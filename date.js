//jshint esversion:6

exports.getDate = function() {
const today = new Date(); //JavaScript will use the browser's time zone and display a date as a full text string:
// var currentDay = today.getDate(); //The getDay() method returns the day of the week (from 0 to 6) for the specified date.
// var day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// if (currentDay === 6 || currentDay === 0){
//   day ="Weekend"; // will pass a new word and  it will go to render section later
// } else {
//       day ="Weekday";
// }

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

 return today.toLocaleDateString("en-US", options);

};


exports.getDay=function() {
const today = new Date();
  const options = {
    weekday: "long",
  };
 return today.toLocaleDateString("en-US", options);
};
