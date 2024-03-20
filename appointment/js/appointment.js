import { FormConfig, CalSet, printForm, insertCss, allInOne, setCalsetValue } from "./importExport.js";

insertCss();
printForm();

//////////////////////////////////////
// result html out and listener reset and submit
//for form on page
export function appointment(calendar, url_for_data_request = '', service_id = '', master_id = '', token = '') {
  if (url_for_data_request == '' || url_for_data_request == 'undefined' || url_for_data_request == null) {
    allInOne(calendar);
  } else {
    async function data_from_db(url_for_data_request, service_id = '', master_id = '', token = '') {
      const myHeaders = {
        Accept: 'application/json',
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
        referrerPolicy: 'no-referrer', // no-referrer, *client. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
        body: "master_id=" + master_id + "&service_id=" + service_id
        // JSON.stringify(data) // body data type must match "Content-Type" header
      };
      const myRequest = new Request(url_for_data_request, myInit);
      const response = await fetch(myRequest);
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      //const mytoken = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Data from server is not JSON!");
      }
      return await response.json();
    }

    data_from_db(url_for_data_request, service_id, master_id, token)
      .then(CalSetFromServer => {
        // set new value for Calset
        setCalsetValue(CalSetFromServer, CalSet);
        // print calendar
        allInOne(calendar);
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }
}
