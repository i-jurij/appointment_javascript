import { FormConfig, CalSet, printForm, insertCss, allInOne } from "./importExport.js";

insertCss();
printForm();

//////////////////////////////////////
// result html out and listener reset and submit
//for form on page
export function appointment(calendar, url_to_php_script = '', service_id = '', master_id = '', token = '') {
  if (url_to_php_script == '' || url_to_php_script == 'undefined' || url_to_php_script == null) {
    allInOne(calendar);
  } else {
    async function data_from_db(url_to_php_script, enter_data = '') { // or data = {}
      const myHeaders = {
        //'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-CSRF-TOKEN": token
      };

      const myInit = {
        method: "POST",
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: myHeaders,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: enter_data
        // JSON.stringify(data) // body data type must match "Content-Type" header
      };
      const myRequest = new Request(url_to_php_script, myInit);
      const response = await fetch(myRequest);
      const contentType = response.headers.get('content-type');
      //const mytoken = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Data from server is not JSON!");
      }

      return await response.json();
    }

    data_from_db(url_to_php_script, "master_id=" + master_id + "&service_id=" + service_id)
      .then(promise => promise)
      .then(CalSetFromPHP => {
        if (CalSetFromPHP.lehgthCal !== null) CalSet.lehgthCal = CalSetFromPHP.lehgthCal;
        if (CalSetFromPHP.endtime !== null) CalSet.endtime = CalSetFromPHP.endtime;
        if (CalSetFromPHP.period !== null) CalSet.period = CalSetFromPHP.period;
        if (CalSetFromPHP.worktime !== null) CalSet.worktime = CalSetFromPHP.worktime;
        if (CalSetFromPHP.lunch !== null) CalSet.lunch = CalSetFromPHP.lunch;
        if (CalSetFromPHP.orgWeekend !== null) CalSet.orgWeekend = CalSetFromPHP.orgWeekend;
        if (CalSetFromPHP.restDayTime !== null) CalSet.restDayTime = CalSetFromPHP.restDayTime;
        if (CalSetFromPHP.holiday !== null) CalSet.holiday = CalSetFromPHP.holiday;
        if (CalSetFromPHP.existAppDateTimeArr !== null) CalSet.existAppDateTimeArr = CalSetFromPHP.existAppDateTimeArr;
        if (CalSet.servDuration !== null) CalSet.servDuration = CalSet.servDuration;

        allInOne(calendar);
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }
}
