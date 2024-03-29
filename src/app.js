// UNCOMMENT ONLY FOR MINIMIZING //
//import "./style.css";
////////////////////////
// APPLICATION //

// uncomment next three lines if no PHP //
//import { cssStyle } from "./style.css.js"; // renamed style.css if no php
//import { insertCss } from "./scripts/insertCss.js";
//insertCss(FormConfig, cssStyle);

import { CalSet, setCalsetValue, FormConfig } from "./scripts/config.js";
import { printForm } from "./scripts/form.html.js";
import { GetAppointment } from "./scripts/getAppointment.js";
import { CommonFunc } from "./scripts/commonFunc.js";
import { modalAlert } from "./scripts/modalAlert.js";
import { ServDurationCheck } from "./scripts/servDurationCheck.js";
import { monthCalendar } from './scripts/monthCalendar.js';
import { shortCalendar } from './scripts/shortCalendar.js';
import { scheduleCalendar } from './scripts/scheduleCalendar.js';
import { AllInOne } from "./scripts/allInOne.js";

export function printCalendar(calendar, url_for_data_request = '', service_id = '', master_id = '', token = '') {
    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    }
 
    printForm(FormConfig);
    let divForTimeChoice = document.querySelector(`#${FormConfig.divForTimeChoiceId}`);
    
    // get updated calendar with marked dates 
    let CalSetNew = new GetAppointment(CalSet, setCalsetValue);

    if (url_for_data_request == '' || url_for_data_request == 'undefined' || url_for_data_request == null) {
        let Com = new CommonFunc(FormConfig, CalSet);
        let SD = new ServDurationCheck(CalSet, FormConfig, divForTimeChoice, Com, modalAlert);
        let AiO = new AllInOne(CalSet, FormConfig, divForTimeChoice, Com, modalAlert, SD, shortCalendar, monthCalendar, scheduleCalendar);
        AiO.printCal(calendar, url_for_data_request, service_id, master_id, token);

    } else {
        CalSetNew.data_from_db(url_for_data_request, service_id, master_id, token)
            .then(CalSetFromServer => {
                // set new value for Calset
                CalSetNew.setCalsetValue(CalSetFromServer, CalSetNew.data);
                //console.info(CalSetNew.data)
                let Com = new CommonFunc(FormConfig, CalSetNew.data);
                let SD = new ServDurationCheck(CalSetNew.data, FormConfig, divForTimeChoice, Com, modalAlert);
                let AiO = new AllInOne(CalSetNew.data, FormConfig, divForTimeChoice, Com, modalAlert, SD, shortCalendar, monthCalendar, scheduleCalendar);
                AiO.printCal(calendar, url_for_data_request, service_id, master_id, token);
            })
            .catch(function (err) {
                console.log("Fetch Error :-S", err);
            });
    }
}