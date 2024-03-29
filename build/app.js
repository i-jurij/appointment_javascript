/**
* data object with calendar settings
*/
let CalSet = {
    lehgthCal: 14, //for short and month calendar
    endtime: "17:00",
    period: 60,
    worktime: ['09:00', '19:00'],
    lunch: ["12:00", 60],
    orgWeekend: { 'Сб': '14:00', 'Вс': '' },
    restDayTime: { '2024-03-22': [], '2024-04-03': [], '2024-04-21': ['16:00', '17:00', '18:00'], '2024-04-28': ['10:00', '11:00', '14:00'] },
    holiday: ['2024-02-23', '2024-03-08', '2024-05-01', '2024-06-12', '2024-06-30'],
    existAppDateTimeArr: {},
    servDuration: '120',
    /////////////////////////////
    locale: 'ru-RU', // for time localisation eg en-EN us-US
    long: 'short', // for week day name eg 'long'
    // Дни недели с понедельника
    daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    dw: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthsFullName: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShortName: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
};
 /**
  * rewrite data in Calset object
  * @param {object} CalSetFromServer 
  * @param {object} CalSet 
  */
function setCalsetValue(CalSetFromServer, CalSet) {
    let keys = Object.keys(CalSetFromServer);
    if (!!keys) {
        keys.forEach(function (key) {
            if (CalSet.hasOwnProperty(key)) {
                CalSet[key] = CalSetFromServer[key];
            }
        });
    }
}

/**
 * begins data for html form
 */
let FormConfig = {
    appointmentTag: "appointment_tag",
    formId: "zapis_usluga_form",
    formMethod: "POST",
    formAction: "", //url for send data from form
    divForTimeChoiceId: "time_choice",
    buttonsDivId: 'buttons_div',
    buttonsDivClassName: "hor_center buts",
    buttonSubmitId: 'zapis_usluga_form_sub',
    buttonsSubmitClassName: "but",
    buttonSubmitText: "Готово",
    buttonResetId: 'zapis_usluga_form_res',
    buttonResetText: 'Сбросить',
    buttonsResetClassName: "but",

};

/*
<form name="zapis_usluga_form" id="zapis_usluga_form">
    <div id="time_choice"></div>
    <div class="hor_center buts" id="buttons_div">
      <button type="button" class="but" id="zapis_usluga_form_res" disabled />Сбросить</button>
      <button type="button" class="but" id="zapis_usluga_form_sub" disabled />Готово</button>
    </div>
  </form>
  */

function printForm(FormConfig) {
  const TAG_FOR_FORM = document.querySelector(FormConfig.appointmentTag);
  if (TAG_FOR_FORM) {
    let zapis_usluga_form = document.createElement('FORM');
    //zapis_usluga_form.action = FormConfig.formAction;
    zapis_usluga_form.id = FormConfig.formId;
    zapis_usluga_form.name = FormConfig.formId;
    zapis_usluga_form.method = FormConfig.formMethod;
    /*
      my_tb=document.createElement('INPUT');
      my_tb.type='HIDDEN';
      my_tb.name='hidden1';
      my_tb.value='Values of my hidden1';
      my_form.appendChild(my_tb);
    */
    let divForTimeChoiceId = document.createElement('DIV');
    divForTimeChoiceId.id = FormConfig.divForTimeChoiceId;

    let buttons_div = document.createElement('DIV');
    buttons_div.className = FormConfig.buttonsDivClassName;
    buttons_div.id = FormConfig.buttonsDivId;

    let but_subm = document.createElement('BUTTON');
    but_subm.type = 'button';
    but_subm.className = FormConfig.buttonsSubmitClassName;
    but_subm.id = FormConfig.buttonSubmitId;
    but_subm.disabled = true;
    let but_subm_text = document.createTextNode(FormConfig.buttonSubmitText);
    but_subm.appendChild(but_subm_text);

    buttons_div.appendChild(but_subm);

    let but_res = document.createElement('BUTTON');
    but_res.type = 'button';
    but_res.className = FormConfig.buttonsResetClassName;
    but_res.id = FormConfig.buttonResetId;
    but_res.disabled = true;
    let but_res_text = document.createTextNode(FormConfig.buttonResetText);
    but_res.appendChild(but_res_text);

    buttons_div.appendChild(but_res);
    buttons_div.appendChild(but_subm);

    zapis_usluga_form.appendChild(divForTimeChoiceId);
    zapis_usluga_form.appendChild(buttons_div);

    TAG_FOR_FORM.appendChild(zapis_usluga_form);
  }
}

//////////////////////////////////////
// result html out and listener reset and submit
//for form on page
class GetAppointment {
  constructor(CalSet, setCalsetValue){
    this.data = CalSet;
    this.setCalsetValue = setCalsetValue;
  }

  async data_from_db(url_for_data_request, service_id = '', master_id = '', token = '') {
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
}

/*
Алгоритм:
Условия: все временные метки для дней с нулевым временем (00:00:00)
1. Сформировать объект дат с учетом выходных из orgWeekend (только дни с пустыми временами начала выходных)
date = { date(datetime): mark(dis or check) }
2. Сформировать объект всех дат-времен с начала рабочего дня с указанным периодом до конца рабочего дня без времени обеда
dt = {
  date0(datetime): { time0(datetime): "", time1(datetime): "", ..., timen(datetime): "" },
  ...
  daten(datetime): { time0(datetime): "", time1(datetime): "", ..., timen(datetime): "" },
}
3. Пометить времена в объекте дат-времен как отключенные, если они есть в объектах restDayTime (часы отдыха),
exist_app_dt_arr (записи на прием) и orgWeekend (даты со временем начала выходных)
*/
class CommonFunc {
    constructor(FormConfig, CalSetUpdated) {
        this.FormConfig = FormConfig;
        this.Calset = CalSetUpdated;
        /**
         * var time_not_allowed - промежуток времени, в который нельзя записаться
         * на сегодня после текущего времени в часах
         * например сейчас 13.00 - если time_not_allowed = 1: 14.00 будет занято,
         * записаться можно на 15.00
         * Нужен, чтобы клиенты не записывались в последний момент
         */
        this.time_not_allowed = 1;
    }
    pad(n) {
        return n < 10 ? '0' + n : n;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
    * Adds time to a date. Modelled after MySQL DATE_ADD function.
    * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
    * https://stackoverflow.com/a/1214753/18511
    *
    * @param date  Date to start with
    * @param interval  One of: year, quarter, month, week, day, hour, minute, second
    * @param units  Number of units of the given interval to add.
    */
    dateAdd(date, interval, units) {
        if (!(date instanceof Date))
            return undefined;
        var ret = new Date(date); //don't change original date
        var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
        switch (String(interval).toLowerCase()) {
            case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
            case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
            case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
            case 'week': ret.setDate(ret.getDate() + 7 * units); break;
            case 'day': ret.setDate(ret.getDate() + units); break;
            case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
            case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
            case 'second': ret.setTime(ret.getTime() + units * 1000); break;
            default: ret = undefined; break;
        }
        return ret;
    }


    /**
     * function for getting all dates for processing (all times is 00:00:00)
     */
    getDaysArray(start, end) {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            dt.setHours(0, 0, 0, 0);
            arr.push(new Date(dt));
        }
        return arr;
    }

    work_time_start_dt(data) {
        const work_time_start = this.Calset.worktime[0].split(':');
        const wksdt = new Date(data).setHours(work_time_start[0], work_time_start[1]);
        return wksdt
    }

    work_time_end_dt(data) {
        const work_time_end = this.Calset.worktime[1].split(':');
        const wkedt = new Date(data).setHours(work_time_end[0], work_time_end[1]);
        return wkedt
    }

    /** 
     * get name of day of week
     */
    getDayName(dateStr, locale, long) {
        if (!dateStr) dateStr = new Date();
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: long });
    }

    round_period(CalSet_period) {
        let rp;
        if (CalSet_period < 10) {
            rp = CalSet_period * 60;
        } else {
            rp = (CalSet_period > 5 && CalSet_period < 16) ? 15 : Math.ceil(Number(CalSet_period / 10)) * 10;
        }
        return rp;
    }

    lunch(datetime_string) {
        const lunch_arr = this.Calset.lunch[0].split(':');
        const lunch_hour = lunch_arr[0];
        const lunch_min = lunch_arr[1];
        const lunch_dur = this.Calset.lunch[1];
        const lunchstart_dt = new Date(new Date(datetime_string).setHours(lunch_hour, lunch_min, 0, 0));
        const lunchend_dt = this.dateAdd(lunchstart_dt, 'minute', lunch_dur);
        return [lunchstart_dt, lunchend_dt]
    }

    /**
     * get all dates for processing
     */
    all_dates() {
        let start = Date.now();
        let end = (new Date()).setDate((new Date()).getDate() + (this.Calset.lehgthCal - 1));
        let res = this.getDaysArray(start, end);

        let now = new Date();
        let tm = this.Calset.endtime.split(":");
        let endnow = new Date((new Date(now)).setHours(tm[0], tm[1]));
        //IF CURRENT TIME MORE THEN CalSet.endtime - DEL FIRST DATE (TODAY) AND PUSH MORE ONE DATE INTO DATEARRAY
        if (now.getTime() > endnow.getTime()) {
            //get last elem
            let last_day = res.at(-1);
            //add one day
            let ld = new Date(last_day);
            let add_day = ld.setDate(ld.getDate() + 1);
            res.push(new Date(add_day));
            res.shift();
        }
        return res;
    }

    /**
     * create holiday and rest days arrays
     */
    holidays() {
        if (this.Calset.holiday.constructor.name == "Array") {
            //var holiday = CalSet.holiday.map(item => new Date(new Date(item).setHours(0, 0, 0, 0)));
            var holiday = this.Calset.holiday.map(item => new Date(item).setHours(0, 0, 0, 0));
        }
        return holiday;
    }

    rest_days() {
        var restdays = [];
        for (const key in this.Calset.restDayTime) {
            if (Object.hasOwnProperty.call(this.Calset.restDayTime, key)) {
                const dt = new Date(key);
                dt.setHours(0, 0, 0, 0);
                const element = this.Calset.restDayTime[key];
                if (element.length <= 0) {
                    //restdays.push(key)
                    let date = new Date(key).setHours(0, 0, 0, 0);
                    restdays.push(date);
                }
            }
        }
        return restdays;
    }

    /** 
     * ALL DAYS MARKED - disable if weekend, checked if first work day
     */
    markedDates() {
        let holiday = this.holidays();
        let restdays = this.rest_days();
        let dateArray = this.all_dates();
        let days = {};
        for (let index = 0; index < dateArray.length; index++) {
            let element = dateArray[index];
            const year = element.getFullYear();
            const month = element.getMonth();
            const day = element.getDate();
            year + "-" + this.pad((month + 1)) + "-" + this.pad(day);

            //if date is holiday - mark it
            //const hol = holiday.find(date => date.toDateString() === element.toDateString());
            const hol = (holiday) ? holiday.includes(element.getTime()) : [];
            if (hol) {
                days[element] = "disabled";
                //div_cont.innerHTML = div_cont.innerHTML + dateArray[index] +'\n<br>';
                continue;
            }

            //if name of day of week existed in CalSet.orgWeekend - mark it
            const name_of_day = this.getDayName(element, this.Calset.locale, this.Calset.long);
            const cnd = this.capitalizeFirstLetter(name_of_day);
            if (((name_of_day in this.Calset.orgWeekend)
                && (this.Calset.orgWeekend[name_of_day] === '' || this.Calset.orgWeekend[name_of_day] === null))
                || ((cnd in this.Calset.orgWeekend) && (this.Calset.orgWeekend[cnd] === '' || this.Calset.orgWeekend[cnd] === null))
            ) {
                days[element] = "disabled";
                continue
            }

            const rest = (restdays.includes(element.getTime()));
            if (rest) {
                days[element] = "disabled";
                continue
            }
            // if el not isset
            days[element] = "";
        }
        //checked first work day
        for (const key in days) {
            if (Object.hasOwnProperty.call(days, key)) {
                const element = days[key];
                if (element === "") {
                    days[key] = 'checked';
                    break
                }
            }
        }
        //console.log(days)
        return days;
    }

    /**
     * times for date
     */
    times(datestring) {
        const period = this.round_period(this.Calset.period);
        const dt = (datestring) ? new Date(datestring) : new Date();
        const year = dt.getFullYear();
        const month = dt.getMonth();
        const day = dt.getDate();

        let lunchh = this.lunch(datestring);
        let lunchstart_dt = lunchh[0];
        let lunchend_dt = lunchh[1];

        let times = {};

        let startt = this.Calset.worktime[0].split(':');
        let endd = this.Calset.worktime[1].split(':');
        const start = new Date(year, month, day, startt[0], startt[1], 0, 0);
        const end = new Date(year, month, day, endd[0], endd[1], 0, 0);
        for (let index = start; index < end; index = this.dateAdd(index, 'minute', period)) {
            if (index < lunchstart_dt || index >= lunchend_dt) {
                times[index] = '';
                //console.log(this.pad(hours)+':'+this.pad(min))
            }
        }
        if (!(lunchstart_dt in times)) {
            times[lunchstart_dt] = 'disabled';
        }
        if (!(lunchend_dt in times)) {
            times[lunchend_dt] = '';
        }
        return times;
    }

    /**
     * ALL DATE_TIMES
     */
    date_times() {
        let marked_date_obj = this.markedDates();
        let dt = {};
        for (const date in marked_date_obj) {
            if (Object.hasOwnProperty.call(marked_date_obj, date)) {
                const mark_d = marked_date_obj[date];
                if (mark_d === '' || mark_d === 'checked') {
                    dt[date] = this.times(date);
                    //console.log(dt[date])
                }
            }
        }
        return dt
    }

    rest_dt() {
        let period = this.round_period(this.Calset.period);
        // create object with rest times
        let rest_times = {};
        for (const date in this.Calset.restDayTime) {
            if (Object.hasOwnProperty.call(this.Calset.restDayTime, date)) {
                const element = this.Calset.restDayTime[date];
                if (element.length > 0) {
                    rest_times[date] = {};
                    for (let i = 0; i < element.length; i++) {
                        const el = element[i];
                        const h_m_t = el.split(':');
                        const h = h_m_t[0];
                        const m = h_m_t[1];
                        const start = new Date(new Date(date).setHours(h, m, 0, 0));
                        const end = new Date(this.dateAdd(new Date(start), 'minute', period).getTime());
                        rest_times[date][start] = 'disabled';
                        if (end < this.work_time_end_dt(date)) {
                            if (!(end in rest_times[date])) {
                                rest_times[date][end] = '';
                            }
                        }
                    }
                }
            }
        }
        //console.log(rest_times)
        let dt = this.date_times();
        for (const date in dt) {
            if (Object.hasOwnProperty.call(dt, date)) {
                const times = dt[date];
                for (const data in rest_times) {
                    if (Object.hasOwnProperty.call(rest_times, data)) {

                        const rest = rest_times[data];
                        for (const rest_t in rest) {
                            if (Object.hasOwnProperty.call(rest, rest_t)) {
                                if (rest_t in times && times[rest_t] === '') {
                                    dt[date][rest_t] = rest[rest_t];
                                } else if (date === data && !(rest_t in times)) {
                                    dt[date][rest_t] = rest[rest_t];
                                }
                            }
                        }
                    }
                }
            }
        }
        //console.log(dt)
        return dt;
    }

    appTimes() {
        let period = this.round_period(this.Calset.period);
        //create appointment object from CalSet.existAppDateTimeArr
        let date_time = this.rest_dt();
        let exist_app_date_time_obj = {};
        let start_end = {};
        for (const data in this.Calset.existAppDateTimeArr) {
            if (Object.hasOwnProperty.call(this.Calset.existAppDateTimeArr, data)) {
                const dt = new Date(new Date(data).setHours(0, 0, 0, 0));
                exist_app_date_time_obj[dt] = {};
                start_end[dt] = [];

                const times = this.Calset.existAppDateTimeArr[data];
                //console.log(element)
                for (const time in times) {
                    if (Object.hasOwnProperty.call(times, time)) {
                        let app_end = '';
                        let hour = time.split(':');
                        const app_start = new Date(new Date(data).setHours(hour[0], hour[1]));
                        const dur = times[time];
                        if (dur) {
                            //if length of service > 5 then minutes, else hours
                            //если длительность услуги меньше 5  - значит обозначено в часах
                            const interval = (dur > 5) ? 'minute' : 'hour';
                            const serv_dur = (dur > 5) ? dur : Math.ceil(Number(dur * 60 / 10)) * 10;
                            app_end = this.dateAdd(app_start, interval, serv_dur);
                        } else {
                            app_end = this.dateAdd(app_start, 'minute', period);
                        }
                        exist_app_date_time_obj[dt][app_start] = 'disabled';
                        start_end[dt].push([app_start, app_end]);

                        if (app_end < this.work_time_end_dt(dt)) {
                            if (!(app_end in exist_app_date_time_obj[dt])) {
                                exist_app_date_time_obj[dt][app_end] = '';
                            }
                        }
                    }
                }
            }
        }
        //console.log(exist_app_date_time_obj)
        //console.log(start_end)

        // объединим объект date_time (с отмеченными выходными часами) и объект с временами начала и окончания записей на услуги
        // те, если такого времени нет - допишем его
        for (const app_date in exist_app_date_time_obj) {
            if (Object.hasOwnProperty.call(exist_app_date_time_obj, app_date)) {
                const app_times = exist_app_date_time_obj[app_date];
                if (app_date in date_time) {
                    for (const app_time in app_times) {
                        if (Object.hasOwnProperty.call(app_times, app_time)) {
                            let app_mark = app_times[app_time];
                            if (app_time in date_time[app_date] && date_time[app_date][app_time] != 'disabled') {
                                date_time[app_date][app_time] = app_mark;
                            }
                            if (!(app_time in date_time[app_date])) {
                                date_time[app_date][app_time] = app_mark;
                            }
                        }
                    }
                }
            }
        }

        //пометим времена услуг
        for (const se_date in start_end) {
            if (Object.hasOwnProperty.call(start_end, se_date)) {
                const se_arr = start_end[se_date];
                if (se_date in date_time) {
                    for (let i = 0; i < se_arr.length; i++) {
                        const se = se_arr[i];
                        for (const dt_time in date_time[se_date]) {
                            if (Object.hasOwnProperty.call(date_time[se_date], dt_time)) {
                                const dt_mark = date_time[se_date][dt_time];
                                if ((se[0].getTime() < new Date(dt_time).getTime() || se[0].getTime() < new Date(dt_time).getTime()) && se[1].getTime() > new Date(dt_time).getTime() && (dt_mark === '' || dt_mark === null)) {
                                    date_time[se_date][dt_time] = 'disabled';
                                }
                            }
                        }
                    }
                }
            }
        }
        //console.log(date_time)
        return date_time;
    }

    weekend_times() {
        // use appa_times as date_times without rest days
        let date_time = this.appTimes();
        let h_m = '';

        for (const date in date_time) {
            const dt_times = date_time[date];
            const name_of_day = this.getDayName(new Date(date), this.Calset.locale, this.Calset.long);
            const cnd = this.capitalizeFirstLetter(name_of_day);

            let z1 = name_of_day in this.Calset.orgWeekend;
            let z2 = cnd in this.Calset.orgWeekend;
            if (z1 && (this.Calset.orgWeekend[name_of_day] !== '' || this.Calset.orgWeekend[name_of_day] !== null)) {
                h_m = this.Calset.orgWeekend[name_of_day].split(':');
            } else if (z2 && (this.Calset.orgWeekend[cnd] !== '' || this.Calset.orgWeekend[cnd] !== null)) {
                h_m = this.Calset.orgWeekend[cnd].split(':');
            }
            if ((z1 || z2) && h_m !== '') {
                const hour = h_m[0];
                const min = h_m[1];
                const week_start = new Date(new Date(date).setHours(hour, min, 0, 0));
                //console.log(week_start)
                for (const time in dt_times) {
                    if (Object.hasOwnProperty.call(dt_times, time)) {
                        if (week_start.getTime() <= new Date(time).getTime()) {
                            date_time[date][time] = "disabled";
                        }
                    }
                }
            }
        }
        //console.log(date_time)
        return date_time;
    }

    sortDateTimeArr() {
        let date_time = this.weekend_times();
        for (const date in date_time) {
            if (Object.hasOwnProperty.call(date_time, date)) {
                const times = date_time[date];

                const sort_times = Object.keys(times).sort().reduce(
                    (obj, key) => {
                        obj[key] = times[key];
                        return obj;
                    },
                    {}
                );
                date_time[date] = sort_times;
            }
        }
        return date_time
    }

    /**
     * listener for submit, reset enabled 
     * @param {string} class_for_check 
     */
    buttonsListener(class_for_check) {
        let that = this;
        let mdt = document.querySelector(class_for_check);
        let butdiv = document.getElementById(this.FormConfig.buttonsDivId);
        let butsubmit = document.getElementById(this.FormConfig.buttonSubmitId);
        let butreset = document.getElementById(this.FormConfig.buttonResetId);
        if (!!mdt) {
            mdt.addEventListener('click', function (dt_el) {
                if (dt_el.target.disabled != "disabled" && dt_el.target.name == 'time') {
                    butsubmit.disabled = true;
                    if (!!butdiv && !!butsubmit) {
                        let time_checked = document.querySelectorAll(class_for_check + ' input[name="time"]:checked');
                        if (!!time_checked && time_checked.length > 0) {
                            butdiv.scrollIntoView();
                            butsubmit.disabled = false;
                            butsubmit.focus();
                            butreset.setAttribute('type', 'reset');
                            butreset.disabled = false;
                        }
                    }
                }
            });
        }
        butreset.addEventListener('click', function () {
            butsubmit.disabled = true;
        });

        butsubmit.addEventListener('click', function () {
            let time_checked = document.querySelectorAll(class_for_check + ' input[name="time"]:checked');
            if (!!time_checked && time_checked.length > 0) {
                document.getElementById(that.FormConfig.formId).submit();
            }
        });
    }
}

function modalAlert(message_string) {
    var newDiv = document.createElement('div');
    newDiv.classList.add('modal');
    newDiv.id = "alert";
    newDiv.innerHTML = '<div><p>' + message_string + '</p><button id="alert_ok">OK</button></div>';
    // Добавляем только что созданный элемент в дерево DOM
    let my_div;
    if (!!this.divForTimeChoice) {
        my_div = this.divForTimeChoice;
    }
    //document.body.insertBefore(newDiv, my_div);
    my_div.parentNode.insertBefore(newDiv, my_div);
    // setup body no scroll
    document.body.style.overflow = 'hidden';

    let but = document.getElementById('alert_ok');
    but.focus();
    but.addEventListener('click', function (ev) {
        newDiv.remove();
        // setup body scroll
        document.body.style.overflow = 'visible';
    });
}

class ServDurationCheck {
    constructor(CalsetUpdated, FormConfig, divForTimeChoice, Common, modalAlert) {
        this.divForTimeChoice = divForTimeChoice;
        this.FormConfig = FormConfig;
        this.Calset = CalsetUpdated;
        this.Com = Common;
        this.modalAlert = modalAlert;
    }

    /**
     * CHECK IF SERV DURATION < time interval between appointment times
     */
    servDurationF() {
        let message0 = ' Недостаточно времени для оказания услуги до конца рабочего дня.\n<br /> Пожалуйста, выберите другое время.';
        let message1 = ' Недостаточно свободного времени для оказания услуги.\n<br /> Пожалуйста, выберите другое время.';
        let butsubmit = document.getElementById(this.FormConfig.buttonSubmitId);

        const dur = this.Calset.servDuration;
        if (!!this.divForTimeChoice) {
            let t_div = document.querySelectorAll('.master_times');
            if (!!t_div) {
                let that = this;
                t_div.forEach(element => element.addEventListener("change", function (ev) {
                    //dt = ev.target.id
                    let date_inp_chek;
                    let dtime;
                    if (!!document.querySelector('#tableId > tbody')) {
                        let date_in_table = document.querySelector('.today');
                        dtime = (!!date_in_table) ? date_in_table.id.slice(2) : null;
                    } else {
                        date_inp_chek = document.querySelector('input[type="radio"][name="date"]:checked');
                        dtime = (!!date_inp_chek) ? date_inp_chek.value : null;
                    }
                    let time_inp_chek = document.querySelector('input[type="radio"][name="time"]:checked');
                    if (!!time_inp_chek && dtime) {
                        let ttime = time_inp_chek.value;
                        const serv_dt_start = new Date().setTime(ttime);
                        const serv_dt_end = that.Com.dateAdd(new Date(new Date().setTime(ttime)), 'minute', dur).getTime();
                        const date = new Date(new Date(serv_dt_start).setHours(0, 0, 0, 0));
                        let end_work_time_dt = that.Com.work_time_end_dt(new Date().setTime(dtime));
                        //next time
                        const dt_arr = that.Com.sortDateTimeArr();
                        if (date in dt_arr) {
                            let times = Object.entries(dt_arr[date]);
                            //find next value with disabled and compare with serv_end
                            //if less - ok, if more - not ok: shoose other time
                            for (let index = 0; index < times.length; index++) {
                                // укажем нужный элемент массива дат-времен
                                const elem = times[index];
                                const elem_t = new Date(elem[0]).getTime();

                                if (elem_t === serv_dt_start) {
                                    // если след элем == последнему элементу массива - проверим,
                                    // что длительность услуги не больше чем конец раб времени
                                    let ind = index + 1;
                                    if ((ind) === times.length) {
                                        if (serv_dt_end > end_work_time_dt) {
                                            that.modalAlert(message0);
                                            //alert('Недостаточно времени для оказания услуги до конца рабочего дня.\n Пожалуйста, выберите другое время.');
                                            time_inp_chek.checked = false;
                                            butsubmit.disabled = true;
                                            break;
                                        }
                                    } else if ((ind) < times.length) {
                                        // найдем первый элемент массива после текущего, в котором есть disabled
                                        // и проверим, что длительность услуги укладывается в этот интервал
                                        for (ind; ind < times.length; ind++) {
                                            let next = times[ind];
                                            let dis = next[1];
                                            let next_time_dt = new Date(next[0]);
                                            if (dis) {
                                                if (serv_dt_end > next_time_dt) {
                                                    that.modalAlert(message1);
                                                    //alert('Недостаточно свободного времени для оказания услуги.\n Пожалуйста, выберите другое время.');
                                                    time_inp_chek.checked = false;
                                                    butsubmit.disabled = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }));
            }
        }
    }
}

// month calendar
class Month {
    constructor(Common, CalSet, ServDurationCheck, divId, div_id_for_times_out) {
        this.Common = Common;
        this.CalSet = CalSet;
        this.ServDurationCheck = ServDurationCheck;
        //Сохраняем идентификатор div
        this.divId = divId;
        this.div_id_for_times_out = div_id_for_times_out;
        // Дни недели с понедельника
        this.DaysOfWeek = this.CalSet.daysOfWeek;
        // Месяцы начиная с января
        this.Months = this.CalSet.monthsFullName;
        //Устанавливаем текущий месяц, год
        var d = new Date();
        this.currMonth = d.getMonth();
        this.currYear = d.getFullYear();
        this.currDay = d.getDate();
    }
    // Переход к следующему месяцу
    nextMonth() {
        if (this.currMonth == 11) {
            this.currMonth = 0;
            this.currYear = this.currYear + 1;
        }
        else {
            this.currMonth = this.currMonth + 1;
        }
        this.showcurr();
    }
    // Переход к предыдущему месяцу
    previousMonth() {
        if (this.currMonth == 0) {
            this.currMonth = 11;
            this.currYear = this.currYear - 1;
        }
        else {
            this.currMonth = this.currMonth - 1;
        }
        this.showcurr();
    }
    /**
     * Показать текущий месяц
     */
    showcurr() {
        this.showMonth(this.currYear, this.currMonth);
    }
    /**
     * Показать месяц (год, месяц)
     */
    showMonth(y, m) {
        let marked_date_obj = this.Common.markedDates();
        var firstDayOfMonth = new Date(y, m, 7).getDay()
            // Последний день выбранного месяца
            , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
            // Последний день предыдущего месяца
            ; m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
        var html = '<table id="tableId" class="table_month_cal">';
        // Запись выбранного месяца и года
        html += '<thead><tr>';
        html += '<td colspan="7" class="td_month_cal thead_td_month_cal">' + this.Months[m] + ' ' + y + '</td>';
        html += '</tr></thead>';
        // заголовок дней недели
        html += '<tr class="days">';
        for (var i = 0; i < this.DaysOfWeek.length; i++) {
            html += '<td class="td_month_cal">' + this.DaysOfWeek[i] + '</td>';
        }
        html += '</tr>';

        // Записываем дни
        var i = 1;
        do {
            var dow = new Date(y, m, i).getDay();
            // Начать новую строку в понедельник
            if (dow == 1) {
                html += '<tr>';
            }

            // Если первый день недели не понедельник показать последние дни предыдущего месяца
            else if (i == 1) {
                html += '<tr>';
                for (var j = 0; j < firstDayOfMonth; j++) {
                    //html += '<td class="not-current td_month_cal">' + k + '</td>';
                    html += '<td class="not-current td_month_cal"></td>';
                }
            }
            // Записываем текущий день
            let date = new Date(this.currYear, this.currMonth, i, 0, 0, 0, 0);
            const id = date.getTime();
            //print dates and mark it
            if (date in marked_date_obj && marked_date_obj[date] !== 'disabled') {
                if (marked_date_obj[date] === 'checked') {
                    html += '<td class="today td_month_cal day" id="d_' + id + '">' + i + '</td>';
                } else {
                    html += '<td class="normal td_month_cal day" id="d_' + id + '">' + i + '</td>';
                }
            } else {
                html += '<td class="not-current td_month_cal day" id="d_' + id + '">' + i + '</td>';
            }

            // закрыть строку в воскресенье
            if (dow == 0) {
                html += '</tr>';
            }

            // Если последний день месяца не воскресенье, показать первые дни следующего месяца
            else if (i == lastDateOfMonth) {
                for (dow; dow < 7; dow++) {
                    //html += '<td class="not-current td_month_cal">' + k + '</td>';
                    html += '<td class="not-current td_month_cal"></td>';
                }
            }
            i++;
        } while (i <= lastDateOfMonth);
        // Конец таблицы
        html += '</table>';
        // Записываем HTML в div
        document.getElementById(this.divId).innerHTML = html;
    }

    // function for html of times output in listener
    no_active_times() {
        let html = '';
        html += '<div class="master_times" > <p> Выберите дату перед выбором времени </p>';
        for (let i = 0; i < 7; i++) {
            html += '<div class="master_time ">\
                                    <input type="radio"" id="t_' + i + '" name="time" value="" disabled />\
                                    <label for="t_' + i + '">1' + (i + 1) + ':00</label>\
                                  </div>';
        }
        html += '</div> ';
        return html;
    }

    times_show(date_id) {
        let sl = date_id.slice(2);
        let dt = new Date(new Date().setTime(sl));
        let html = '';
        let date_time_array = this.Common.sortDateTimeArr();
        let options = { weekday: this.CalSet.long, year: 'numeric', month: 'long', day: 'numeric' };

        if (dt in date_time_array) {
            html += '<div class="master_times" style="" id="td_' + new Date(dt).getTime() + '"> <p>' + this.Common.capitalizeFirstLetter(dt.toLocaleDateString(this.CalSet.locale, options)) + '</p>';
            const times = date_time_array[dt];
            let markm = '';
            for (const time in times) {
                if (new Date(time).getTime() < (new Date().addHours(this.Common.time_not_allowed))) {
                    markm = 'disabled';
                } else {
                    markm = times[time];
                }

                html += '<div class="master_time ">\
                            <input type="radio" id="t_' + new Date(time).getTime() + '" name="time" value="' + new Date(time).getTime() + '" ' + markm + ' required />\
                            <label for="t_' + new Date(time).getTime() + '">' + this.Common.pad(new Date(time).getHours()) + ':' + this.Common.pad(new Date(time).getMinutes()) + '</label>\
                          </div>';
            }
            html += '</div> ';
        }
        return html;
    }

    serv_dur_month() {
        this.ServDurationCheck.servDurationF();
        let d_div = document.querySelector('#tableId > tbody');
        let that = this;
        if (!!d_div) {
            d_div.addEventListener('click', function (ev) {
                that.ServDurationCheck.servDurationF();
            });
        }
    }

    listener() {
        //print times for date
        let div_for_time = document.querySelector('#' + this.div_id_for_times_out);
        let class_for_check = '.master_times';
        div_for_time.innerHTML = this.no_active_times();
        if (!!document.querySelector(".today")) {
            let id = document.querySelector(".today").id;
            div_for_time.innerHTML = this.times_show(id);
            this.Common.buttonsListener(class_for_check);
        }
        //del mark on previous checked day, add mark for now checked day, print times of checked day
        var el = document.querySelectorAll(".normal.day, .today.day");
        let that = this;
        for (var i = 0; i < el.length; i++) {
            el[i].onclick = function (e) {
                if (!!document.querySelector(".today")) {
                    document.querySelector(".today").classList.remove("today");
                }
                e.target.classList.add("today");
                let id = e.target.id;
                div_for_time.innerHTML = that.times_show(id);
                that.Common.buttonsListener(class_for_check);
            };
        }
        // let's check that there is enough time listener
        this.serv_dur_month();
    }
}

function monthCalendar(Common, CalSet, divForTimeChoice, ServDurationCheck) {
    // OUTPUT MONTH CALENDAR
    let pre_html = '<button id="btnPrev" type="button"> < Предыдущий</button>\
                <button id="btnNext" type="button">Следующий > </button>\
                <div id="divCal"></div>\
                <div id="divTimes"></div>';
    divForTimeChoice.classList.add('calendar-wrapper');
    divForTimeChoice.innerHTML = '<h3 class="back shad rad pad margin_rlb1">Выберите дату и время</h3>' + pre_html;
    //divForTimeChoice.classList.add('calendar-wrapper')
    //divForTimeChoice.innerHTML = pre_html
    var c = new Month(Common, CalSet, ServDurationCheck, "divCal", "divTimes");
    c.showcurr();
    c.listener();

    getId('btnNext').onclick = function () {
        c.nextMonth();
        c.listener();
    };
    getId('btnPrev').onclick = function () {
        c.previousMonth();
        c.listener();
    };

    function getId(id) {
        return document.getElementById(id);
    }
}

// short calendar
class Short {
    constructor(Common, CalSet, divForTimeChoice) {
        var marked_date_obj = Common.markedDates();
        let dates_arr = Object.keys(marked_date_obj);
        let date_time_array = Common.sortDateTimeArr();
        let view = '<div class="master_datetime">';
        var formatted = dates_arr.map(item => '<div class="master_date">\
              <input type="radio" class="dat" id="d_' + new Date(item).getTime() + '" name="date" value="' + new Date(item).getTime() + '" ' + marked_date_obj[item] + ' required />\
              <label for="d_' + new Date(item).getTime() + '" class="dat_label">'
            + Common.capitalizeFirstLetter(Common.getDayName(item, CalSet.locale, CalSet.long)) + '<br />' + Common.pad(new Date(item).getDate()) + ' ' + CalSet.monthsShortName[new Date(item).getMonth()] +
            '</label>\
              </div>'
        );

        //document.querySelector('#content').innerHTML = formatted.join('');
        view += formatted.join('');
        for (const date in date_time_array) {
            if (Object.hasOwnProperty.call(date_time_array, date)) {
                view += '<div class="master_times" style="display:none;" id="td_' + new Date(date).getTime() + '"> ';

                const times = date_time_array[date];
                let markk = '';
                for (const time in times) {
                    if (new Date(time).getTime() < new Date().addHours(Common.time_not_allowed)) {
                        markk = 'disabled';
                    } else {
                        markk = times[time];
                    }
                    view += '<div class="master_time ">\
                            <input type="radio" id="t_' + new Date(time).getTime() + '" name="time" value="' + new Date(time).getTime() + '" ' + markk + ' required />\
                            <label for="t_' + new Date(time).getTime() + '">' + Common.pad(new Date(time).getHours()) + ':' + Common.pad(new Date(time).getMinutes()) + '</label>\
                          </div>';
                }
                view += '</div> ';
            }
        }
        view += '</div> ';
        //document.querySelector('#content').innerHTML = formatted.join('') + view;
        if (!!divForTimeChoice) {
            divForTimeChoice.innerHTML = view;
        }
    }
    listener(Common, ServDurationCheck) {
        let tc = document.querySelector(".dat:checked");
        let id = (!!tc) ? tc.id : false;
        let div_for_time = document.querySelector('#t' + id);

        if (!!div_for_time) { div_for_time.style.display = "block"; }

        let ele = document.querySelectorAll(".dat");
        for (var i = 0; i < ele.length; i++) {
            ele[i].onclick = function (e) {
                document.querySelectorAll('.master_times').forEach(function (ee) {
                    if (ee.id == 't' + e.target.id) {
                        ee.style.display = '';
                    }
                    else {
                        ee.style.display = 'none';
                    }
                });
                let times = document.querySelectorAll('.master_datetime input[name="time"]');
                times.forEach(function (eee) {
                    if (eee.checked) {
                        eee.checked = false;
                    }
                });
            };
        }
        // let's check that there is enough time
        ServDurationCheck.servDurationF();
        //listener for submit, reset activate
        let class_for_check = '.master_datetime';
        Common.buttonsListener(class_for_check);
    }
}


function shortCalendar(Common, CalSet, divForTimeChoice, ServDurationCheck) {
    var html_short = new Short(Common, CalSet, divForTimeChoice);
    html_short.listener(Common, ServDurationCheck);
}

class Schedule {
    constructor(CalSet, FormConfig, divForTimeChoice, Common, modalAlert, year, month) {
        this.CalSet = CalSet;
        this.FormConfig = FormConfig;
        this.divForTimeChoice = divForTimeChoice;
        this.Common = Common;
        this.modalAlert = modalAlert;
        this.y = (!!year) ? year : new Date().getFullYear();
        this.m = (!!month) ? month : new Date().getMonth();

        this.dates = function (y, m) {
            let md = [];
            let monthDays = new Date(y, m + 1, 0).getDate();
            for (let i = 1; i <= monthDays; i++) {
                let date = new Date(y, m, i, 0, 0, 0, 0);
                md.push(date);
            }
            return md
        };

        this.next_month = function () {
            if (this.m == 11) {
                this.m = 0;
                this.y = this.y + 1;
            }
            else {
                this.m = this.m + 1;
            }
            return this.current_month()
        };

        this.prev_month = function () {
            if (this.m == 0) {
                this.m = 11;
                this.y = this.y - 1;
            }
            else {
                this.m = this.m - 1;
            }
            return this.current_month()
        };

        this.current_month = function () {
            return this.schedule_get(this.dates(this.y, this.m))
        };

        // таблица для графика работы
        this.schedule_get = function (da) {
            let marked_date_obj = this.Common.markedDates();
            let holiday = this.Common.holidays();
            let restdays = this.Common.rest_days();
            //let date_time_array = this.Common.sortDateTimeArr()
            let date_time_array = this.Common.rest_dt();

            let timess = this.Common.times(Date.now());
            let ti = [];
            for (const time in timess) {
                if (Object.hasOwnProperty.call(timess, time)) {
                    const hour = new Date(time).getHours();
                    const min = new Date(time).getMinutes();
                    const t = this.Common.pad(hour) + ':' + this.Common.pad(min);
                    ti.push(t);
                }
            }
            ti.sort();
            //console.log(ti);
            let html = '<div class="clear shed_wrap">\
                        <table class="tc_table">\
                          <thead class=""><tr class="headdate"><th class="tc_td headcol head">&nbsp;</th>';

            let weekend_days = [];
            let weekend_times = {};
            for (const [key, value] of Object.entries(this.CalSet.orgWeekend)) {
                if (value === '') {
                    weekend_days.push(`${key}`);
                } else {
                    //weekendtimes
                    weekend_times[key] = value;
                }
            }
            //dates out
            for (let index = 0; index < da.length; index++) {
                const date = da[index];
                let dis = (date in marked_date_obj) ? 'tc_' + marked_date_obj[date] : '';
                let mark = (dis === "tc_disabled") ? 'tc_checked' : '';
                if (mark === '' && (weekend_days.includes(this.CalSet.dw[date.getDay()]) || holiday.includes(date.getTime()) || restdays.includes(date.getTime()))) {
                    mark = 'tc_checked';
                }
                html += '<th class="tc_td ' + mark + ' head" id="d_' + new Date(date).getTime() + '">'
                    + this.Common.capitalizeFirstLetter(this.Common.getDayName(date, this.CalSet.locale, this.CalSet.long)) + '<br />' +
                    this.Common.pad(new Date(date).getDate()) + '.' + this.Common.pad(new Date(date).getMonth() + 1) +
                    //(new Date(date).toLocaleDateString(this.CalSet.locale, m) + 'a').replace(/[ьй]а$/, 'я')  + '<br />\
                    '</th>';
            }
            html += '</tr></thead><tbody class="master_times">';
            //console.log(date_time_array)
            //times out
            for (let i = 0; i < ti.length; i++) {
                const time = ti[i];
                const hm = time.split(':');
                html += '<tr class=""><td class="tc_td headcol">' + time + '</td>';
                // цикл по объекту времен, если такой даты нет в массиве времен - для нее вывод времен отдельно
                for (let index = 0; index < da.length; index++) {
                    const t = new Date(new Date(da[index]).setHours(hm[0], hm[1], 0, 0));
                    let mark = '';
                    // check weekend, holiday, full restday
                    if (weekend_days.includes(this.CalSet.dw[da[index].getDay()]) || holiday.includes(da[index].getTime()) || restdays.includes(da[index].getTime())) {
                        mark = 'tc_checked';
                    }
                    if (mark === '' && da[index] in date_time_array) {
                        //check if resttimes
                        const times = date_time_array[da[index]];

                        if (t in times && times[t] === 'disabled') {
                            mark = 'tc_checked';
                        }
                    }
                    //check lunch
                    let lunchh = this.Common.lunch(da[index]);
                    let lunchstart_dt = lunchh[0];
                    let lunchend_dt = lunchh[1];
                    if (t >= lunchstart_dt && t < lunchend_dt) {
                        mark = 'tc_checked';
                    }
                    //check if weekend time
                    if (weekend_times.hasOwnProperty(this.CalSet.dw[da[index].getDay()])) {
                        let wt = weekend_times[this.CalSet.dw[da[index].getDay()]].split(':');
                        let weekend_time = new Date(new Date(da[index]).setHours(wt[0], wt[1], 0, 0));
                        if (t.getTime() >= weekend_time.getTime()) {
                            mark = 'tc_checked';
                        }
                    }
                    html += '<td class="' + mark + ' tc_td" id ="d_' + da[index].getTime() + 'dt_' + t.getTime() + '">&nbsp;</td>';
                }
                html += '</tr>';
            }
            html += '   </tbody>\
                    </table>\
                  </div>';
            return html
        };

        this.listener = function () {
            let that = this;
            //schedule output
            let my = { month: 'long', year: 'numeric' };
            let pre_html = '<div class="text_center hor_center schedule_caption">\
                            <span id="btnPre"> < </span>\
                            <span class="month">' + this.Common.capitalizeFirstLetter(new Date(this.y, this.m, 1, 0, 0, 0, 0).toLocaleDateString(this.CalSet.locale, my)).slice(0, -2) + '</span>\
                            <span id="btnNex"> > </span>\
                          </div>\
                          <div id="shed"></div>';
            this.divForTimeChoice.innerHTML = pre_html;
            document.querySelector('#shed').innerHTML = this.current_month();
            let sel_nex = document.getElementById('btnNex');
            let sel_pre = document.getElementById('btnPre');
            sel_pre.onclick = function () {
                document.querySelector('#shed').innerHTML = that.prev_month();
                document.querySelector('.month').innerHTML = that.Common.capitalizeFirstLetter(new Date(that.y, that.m, 1, 0, 0, 0, 0).toLocaleDateString(that.CalSet.locale, my)).slice(0, -2);
                that.listener();
            };
            sel_nex.onclick = function () {
                document.querySelector('#shed').innerHTML = that.next_month();
                document.querySelector('.month').innerHTML = that.Common.capitalizeFirstLetter(new Date(that.y, that.m, 1, 0, 0, 0, 0).toLocaleDateString(that.CalSet.locale, my)).slice(0, -2);
                that.listener();
            };
            let now_date = new Date().setHours(0, 0, 0, 0);
            let dnow = document.getElementById("d_" + now_date);
            if (!!dnow) {
                dnow.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }

            //add or del hidden inputs for shoosed dates
            document.querySelector('.headdate').addEventListener('click', function (el) {
                let dt = el.target.id;
                const times_td = document.querySelectorAll('[id^=' + dt + ']');

                const input_hidden = document.createElement("input");
                input_hidden.type = 'hidden';
                input_hidden.value = dt.slice(2);
                input_hidden.id = 'i' + dt;
                let inp = document.querySelector('#' + input_hidden.id);
                if (!!inp) {
                    inp.parentNode.removeChild(inp);
                    if (el.target.classList.contains('tc_mark_for_del')) {
                        el.target.classList.remove('tc_mark_for_del');
                        el.target.classList.add('tc_checked');
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_mark_for_del');
                            elem.classList.add('tc_checked');
                        });
                    }
                    if (el.target.classList.contains('tc_mark_for_add')) {
                        el.target.classList.remove('tc_mark_for_add');
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_mark_for_add');
                        });
                    }
                } else {
                    if (el.target.classList.contains('tc_checked')) {
                        input_hidden.name = 'deldate[]';
                        el.target.classList.remove('tc_checked');
                        el.target.classList.add('tc_mark_for_del');
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_checked');
                            elem.classList.add('tc_mark_for_del');
                        });
                    } else {
                        input_hidden.name = 'adddate[]';
                        el.target.classList.add('tc_mark_for_add');
                        times_td.forEach(function (elem) {
                            elem.classList.add('tc_mark_for_add');
                        });
                    }
                    document.querySelector('.shed_wrap').appendChild(input_hidden);
                }
            });

            // add or del hidden inputs for shoosed times
            new Date().getTime();
            document.querySelector('.master_times').addEventListener('click', function (element) {
                let tt = element.target.id;
                let dt = tt.split('dt_');
                let time = dt[1];

                const input_hidden = document.createElement("input");
                input_hidden.type = 'hidden';
                input_hidden.name = 'deltime[]';
                input_hidden.id = 'dt' + tt;
                input_hidden.value = time;
                let inp = document.querySelector('#dt' + tt);

                if (!!inp) {
                    inp.parentNode.removeChild(inp);
                    if (element.target.classList.contains('tc_mark_for_del')) {
                        element.target.classList.remove('tc_mark_for_del');
                        element.target.classList.add('tc_checked');
                    }
                    if (element.target.classList.contains('tc_mark_for_add')) {
                        element.target.classList.remove('tc_mark_for_add');
                    }
                } else {
                    if (element.target.classList.contains('tc_checked')) {
                        input_hidden.name = 'deltime[]';
                        element.target.classList.remove('tc_checked');
                        element.target.classList.add('tc_mark_for_del');
                    } else {
                        input_hidden.name = 'daytime[]';
                        element.target.classList.add('tc_mark_for_add');
                    }
                    document.querySelector('.shed_wrap').appendChild(input_hidden);
                }
            });
            // submit, reset listener //
            let reset_button = document.querySelector('#' + that.FormConfig.buttonResetId);
            let submit_button = document.querySelector('#' + that.FormConfig.buttonSubmitId);
            let formmm = document.getElementById(that.FormConfig.formId);
            if (!!formmm) {
                formmm.addEventListener("click", function (element) {
                    if (!!reset_button) { reset_button.disabled = false;} 
                    if (!!submit_button) { submit_button.disabled = false;} 

                    if (element.target.id == that.FormConfig.buttonResetId) {
                        document.querySelectorAll('.tc_mark_for_add').forEach((item) => {
                            item.classList.remove('tc_mark_for_add');
                        });
                        document.querySelectorAll('.tc_mark_for_del').forEach((item) => {
                            item.classList.remove('tc_mark_for_del');
                            item.classList.add('tc_checked');
                        });
                        document.querySelectorAll('input').forEach((item) => {
                            if (!item.classList.contains('buttons')) {
                                item.remove();
                            }
                        });
                    }

                    if (element.target.id == that.FormConfig.buttonSubmitId) {
                        if (document.querySelectorAll('input').length > 0) {
                            formmm.submit();
                        } else {
                            that.modalAlert('Выберите дату или время');
                        }
                    }
                });
            }
        };
    }
}
function scheduleCalendar(CalSet, FormConfig, divForTimeChoice, Common, modalAlert) {
    var html = new Schedule(CalSet, FormConfig, divForTimeChoice, Common, modalAlert);
    html.listener();
}

class AllInOne {
    constructor(CalSetUpdated, FormConfig, divForTimeChoice, CommonFunc, modalAlert, ServDurationCheck, shortCalendar, monthCalendar, scheduleCalendar) {
        this.CalSetUpdated = CalSetUpdated; 
        this.FormConfig = FormConfig; 
        this.divForTimeChoice = divForTimeChoice;
        this.CommonFunc = CommonFunc;
        this.modalAlert = modalAlert;
        this.ServDurationCheck = ServDurationCheck; 
        this.shortCalendar = shortCalendar;
        this.monthCalendar = monthCalendar;
        this.scheduleCalendar = scheduleCalendar;
    }

    printCal(calendar, url_for_data_request = '', service_id = '', master_id = '', token = '') {

        if (calendar === 'short') {
            this.shortCalendar(this.CommonFunc, this.CalSetUpdated, this.divForTimeChoice, this.ServDurationCheck);
        }
        if (calendar === 'schedule') {
            this.scheduleCalendar(this.CalSetUpdated, this.FormConfig, this.divForTimeChoice, this.CommonFunc, this.modalAlert);
        }
        if (calendar === 'month') {
            this.monthCalendar(this.CommonFunc, this.CalSetUpdated, this.divForTimeChoice, this.ServDurationCheck);
        }
    }
}

// ONLY FOR MINIMIZED //

function printCalendar(calendar, url_for_data_request = '', service_id = '', master_id = '', token = '') {
    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    };
 
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

export { printCalendar };
