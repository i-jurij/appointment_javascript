import { FormConfig, CalSet, modalAlert, monthCalendar } from "./importExport.js";
//set the pages element for calendar
export let divShort = document.querySelector('#' + FormConfig.divForTimeChoiceId);

const mark = "disabled"
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

/*
const year = element.getFullYear();
const month = element.getMonth();
const day = element.getDate();
const Yearmonthday  = year + "-" + pad((month+1)) + "-" + pad(day);
*/

export function pad(n) {
    return n < 10 ? '0' + n : n;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
/**
 * var time_not_allowed - промежуток времени, в который нельзя записаться
 * на сегодня после текущего времени в часах
 * например сейчас 13.00 - если time_not_allowed = 1: 14.00 будет занято,
 * записаться можно на 15.00
 * Нужен, чтобы клиенты не записывались в последний момент
 */
export let time_not_allowed = 1;

/**
* Adds time to a date. Modelled after MySQL DATE_ADD function.
* Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
* https://stackoverflow.com/a/1214753/18511
*
* @param date  Date to start with
* @param interval  One of: year, quarter, month, week, day, hour, minute, second
* @param units  Number of units of the given interval to add.
*/
function dateAdd(date, interval, units) {
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

//function for getting all dates for processing (all times is 00:00:00)
function getDaysArray(start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        dt.setHours(0, 0, 0, 0)
        arr.push(new Date(dt));
    }
    return arr;
};

function work_time_start_dt(data) {
    const work_time_start = CalSet.worktime[0].split(':')
    const wksdt = new Date(data).setHours(work_time_start[0], work_time_start[1])
    return wksdt
}
function work_time_end_dt(data) {
    const work_time_end = CalSet.worktime[1].split(':')
    const wkedt = new Date(data).setHours(work_time_end[0], work_time_end[1])
    return wkedt
}
//get name of day of week
export function getDayName(dateStr, locale, long) {
    if (!dateStr) dateStr = new Date()
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: long });
}

function round_period() {
    let rp;
    if (CalSet.period < 10) {
        rp = CalSet.period * 60
    } else {
        rp = (CalSet.period > 5 && CalSet.period < 16) ? 15 : Math.ceil(Number(CalSet.period / 10)) * 10
    }
    return rp;
}
//let period = round_period()

export function lunch(datetime_string) {
    const dt = (datetime_string) ? new Date(datetime_string) : new Date();
    let lunch_array = []
    const lunch_arr = CalSet.lunch[0].split(':')
    const lunch_hour = lunch_arr[0]
    const lunch_min = lunch_arr[1]
    const lunch_dur = CalSet.lunch[1]
    const lunchstart_dt = new Date(new Date(datetime_string).setHours(lunch_hour, lunch_min, 0, 0));
    const lunchend_dt = dateAdd(lunchstart_dt, 'minute', lunch_dur)
    return lunch_array = [lunchstart_dt, lunchend_dt]
}

//get all dates for processing
function all_dates() {
    let start = Date.now()
    let end = (new Date()).setDate((new Date()).getDate() + (CalSet.lehgthCal - 1))
    let res = getDaysArray(start, end)

    let now = new Date()
    let tm = CalSet.endtime.split(":")
    let endnow = new Date((new Date(now)).setHours(tm[0], tm[1]))
    //IF CURRENT TIME MORE THEN CalSet.endtime - DEL FIRST DATE (TODAY) AND PUSH MORE ONE DATE INTO DATEARRAY
    if (now.getTime() > endnow.getTime()) {
        //get last elem
        let last_day = res.at(-1)
        //add one day
        let ld = new Date(last_day)
        let add_day = ld.setDate(ld.getDate() + 1)
        res.push(new Date(add_day))
        res.shift()
    }
    return res;
}
//let dateArray = all_dates()

// create holiday and rest days arrays
export function holidays() {
    if (CalSet.holiday.constructor.name == "Array") {
        //var holiday = CalSet.holiday.map(item => new Date(new Date(item).setHours(0, 0, 0, 0)));
        var holiday = CalSet.holiday.map(item => new Date(item).setHours(0, 0, 0, 0));
    }
    return holiday
}
//let holiday = holidays()
//console.log(holiday)

export function rest_days() {
    var restdays = []
    for (const key in CalSet.restDayTime) {
        if (Object.hasOwnProperty.call(CalSet.restDayTime, key)) {
            const dt = new Date(key)
            dt.setHours(0, 0, 0, 0)
            const element = CalSet.restDayTime[key];
            if (element.length <= 0) {
                //restdays.push(key)
                let date = new Date(key).setHours(0, 0, 0, 0)
                restdays.push(date)
            }
        }
    }
    return restdays
}
//let restdays = rest_days()
//console.log(restdays)

// ALL DAYS MARKED - disable if weekend, checked if first work day
export function markedDates() {
    let holiday = holidays()
    let restdays = rest_days()
    let dateArray = all_dates()
    let days = {}
    for (let index = 0; index < dateArray.length; index++) {
        let element = dateArray[index];
        let el = '';
        const year = element.getFullYear();
        const month = element.getMonth();
        const day = element.getDate();
        const Yearmonthday = year + "-" + pad((month + 1)) + "-" + pad(day);

        //if date is holiday - mark it
        //const hol = holiday.find(date => date.toDateString() === element.toDateString());
        const hol = holiday.includes(element.getTime());
        if (hol) {
            days[element] = "disabled"
            //div_cont.innerHTML = div_cont.innerHTML + dateArray[index] +'\n<br>';
            continue
        }

        //if name of day of week existed in CalSet.orgWeekend - mark it
        const name_of_day = getDayName(element, CalSet.locale, CalSet.long)
        const cnd = capitalizeFirstLetter(name_of_day)
        if (((name_of_day in CalSet.orgWeekend)
            && (CalSet.orgWeekend[name_of_day] === '' || CalSet.orgWeekend[name_of_day] === null))
            || ((cnd in CalSet.orgWeekend) && (CalSet.orgWeekend[cnd] === '' || CalSet.orgWeekend[cnd] === null))
        ) {
            days[element] = "disabled"
            continue
        }

        const rest = (restdays.includes(element.getTime()))
        if (rest) {
            days[element] = "disabled"
            continue
        }
        // if el not isset
        days[element] = ""
    }
    //checked first work day
    for (const key in days) {
        if (Object.hasOwnProperty.call(days, key)) {
            const element = days[key];
            if (element === "") {
                days[key] = 'checked'
                break
            }
        }
    }
    //console.log(days)
    return days
}
//var marked_date_obj = markedDates()
//console.log(marked_date_obj)

// times for date
export function times(datestring) {
    const period = round_period()
    const dt = (datestring) ? new Date(datestring) : new Date();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const day = dt.getDate();

    let lunchh = lunch(datestring)
    let lunchstart_dt = lunchh[0]
    let lunchend_dt = lunchh[1]

    let times = {}

    let startt = CalSet.worktime[0].split(':')
    let endd = CalSet.worktime[1].split(':')
    const start = new Date(year, month, day, startt[0], startt[1], 0, 0);
    const end = new Date(year, month, day, endd[0], endd[1], 0, 0);
    for (let index = start; index < end; index = dateAdd(index, 'minute', period)) {
        if (index < lunchstart_dt || index >= lunchend_dt) {
            times[index] = ''
            //console.log(pad(hours)+':'+pad(min))
        }
    }
    if (!(lunchstart_dt in times)) {
        times[lunchstart_dt] = 'disabled'
    }
    if (!(lunchend_dt in times)) {
        times[lunchend_dt] = ''
    }
    return times;
}
//let times_arr = times('2023-03-25')
//console.log(times_arr)

// ALL DATE_TIMES
function date_times() {
    let marked_date_obj = markedDates()
    let dt = {}
    for (const date in marked_date_obj) {
        if (Object.hasOwnProperty.call(marked_date_obj, date)) {
            const mark_d = marked_date_obj[date];
            if (mark_d === '' || mark_d === 'checked') {
                dt[date] = times(date)
                //console.log(dt[date])
            }
        }
    }
    return dt
}
//let dt_obj = date_times()
//console.log(dt_obj)

export function rest_dt() {
    let period = round_period()
    // create object with rest times
    let rest_times = {}
    for (const date in CalSet.restDayTime) {
        if (Object.hasOwnProperty.call(CalSet.restDayTime, date)) {
            const element = CalSet.restDayTime[date];
            if (element.length > 0) {
                rest_times[date] = {}
                for (let i = 0; i < element.length; i++) {
                    const el = element[i];
                    const h_m_t = el.split(':')
                    const h = h_m_t[0]
                    const m = h_m_t[1]
                    const start = new Date(new Date(date).setHours(h, m, 0, 0))
                    const end = new Date(dateAdd(new Date(start), 'minute', period).getTime())
                    rest_times[date][start] = 'disabled'
                    if (end < work_time_end_dt(date)) {
                        if (!(end in rest_times[date])) {
                            rest_times[date][end] = ''
                        }
                    }
                }
            }
        }
    }
    //console.log(rest_times)
    let dt = date_times()
    for (const date in dt) {
        if (Object.hasOwnProperty.call(dt, date)) {
            const times = dt[date];
            for (const data in rest_times) {
                if (Object.hasOwnProperty.call(rest_times, data)) {

                    const rest = rest_times[data];
                    for (const rest_t in rest) {
                        if (Object.hasOwnProperty.call(rest, rest_t)) {
                            if (rest_t in times && times[rest_t] === '') {
                                dt[date][rest_t] = rest[rest_t]
                            } else if (date === data && !(rest_t in times)) {
                                dt[date][rest_t] = rest[rest_t]
                            }
                        }
                    }
                }
            }
        }
    }
    //console.log(dt)
    return dt
}
//let rest = rest_dt()
//console.log(rest)

function app_times() {
    let period = round_period()
    //create appointment object from CalSet.existAppDateTimeArr
    let date_time = rest_dt()
    let exist_app_date_time_obj = {}
    let start_end = {}
    for (const data in CalSet.existAppDateTimeArr) {
        if (Object.hasOwnProperty.call(CalSet.existAppDateTimeArr, data)) {
            const dt = new Date(new Date(data).setHours(0, 0, 0, 0))
            exist_app_date_time_obj[dt] = {}
            start_end[dt] = []

            const times = CalSet.existAppDateTimeArr[data];
            //console.log(element)
            for (const time in times) {
                if (Object.hasOwnProperty.call(times, time)) {
                    let app_end = ''
                    let hour = time.split(':')
                    const app_start = new Date(new Date(data).setHours(hour[0], hour[1]))
                    const dur = times[time];
                    if (dur) {
                        //if length of service > 5 then minutes, else hours
                        //если длительность услуги меньше 5  - значит обозначено в часах
                        const interval = (dur > 5) ? 'minute' : 'hour';
                        const serv_dur = (dur > 5) ? dur : Math.ceil(Number(dur * 60 / 10)) * 10
                        app_end = dateAdd(app_start, interval, serv_dur)
                    } else {
                        app_end = dateAdd(app_start, 'minute', period);
                    }
                    exist_app_date_time_obj[dt][app_start] = 'disabled'
                    start_end[dt].push([app_start, app_end])

                    if (app_end < work_time_end_dt(dt)) {
                        if (!(app_end in exist_app_date_time_obj[dt])) {
                            exist_app_date_time_obj[dt][app_end] = ''
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
                        let app_mark = app_times[app_time]
                        if (app_time in date_time[app_date] && date_time[app_date][app_time] != 'disabled') {
                            date_time[app_date][app_time] = app_mark
                        }
                        if (!(app_time in date_time[app_date])) {
                            date_time[app_date][app_time] = app_mark
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
                                date_time[se_date][dt_time] = 'disabled'
                            }
                        }
                    }
                }
            }
        }
    }
    //console.log(date_time)
    return date_time
}
//let exist_app = app_times()
//console.log(exist_app)

//console.log(marked_date_obj)
export function weekend_times() {
    // use appa_times as date_times without rest days
    let date_time = app_times()
    let h_m = ''

    for (const date in date_time) {
        const dt_times = date_time[date];
        const name_of_day = getDayName(new Date(date), CalSet.locale, CalSet.long)
        const cnd = capitalizeFirstLetter(name_of_day)

        let z1 = name_of_day in CalSet.orgWeekend
        let z2 = cnd in CalSet.orgWeekend
        if (z1 && (CalSet.orgWeekend[name_of_day] !== '' || CalSet.orgWeekend[name_of_day] !== null)) {
            h_m = CalSet.orgWeekend[name_of_day].split(':')
        } else if (z2 && (CalSet.orgWeekend[cnd] !== '' || CalSet.orgWeekend[cnd] !== null)) {
            h_m = CalSet.orgWeekend[cnd].split(':')
        }
        if ((z1 || z2) && h_m !== '') {
            const hour = h_m[0]
            const min = h_m[1]
            const week_start = new Date(new Date(date).setHours(hour, min, 0, 0))
            //console.log(week_start)
            for (const time in dt_times) {
                if (Object.hasOwnProperty.call(dt_times, time)) {
                    if (week_start.getTime() <= new Date(time).getTime()) {
                        date_time[date][time] = mark;
                    }
                }
            }
        }
    }
    //console.log(date_time)
    return date_time
}
//let weekend_date_times = weekend_times()

export function sortDateTimeArr() {
    let date_time = weekend_times()
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
            date_time[date] = sort_times
        }
    }
    return date_time
}
//let result_date_time = sortDateTimeArr()
//console.log(result_date_time)

///////////////////////////////////////////////
//CHECK IF SERV DURATION < time interval between appointment times
export function servDurationF() {
    let message0 = ' Недостаточно времени для оказания услуги до конца рабочего дня.\n<br /> Пожалуйста, выберите другое время.';
    let message1 = ' Недостаточно свободного времени для оказания услуги.\n<br /> Пожалуйста, выберите другое время.';
    let butsubmit = document.getElementById(FormConfig.buttonSubmitId);

    const dur = CalSet.servDuration
    if (!!divShort) {
        let t_div = document.querySelectorAll('.master_times')
        if (!!t_div) {
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
                    const serv_dt_end = dateAdd(new Date(new Date().setTime(ttime)), 'minute', dur).getTime();
                    const date = new Date(new Date(serv_dt_start).setHours(0, 0, 0, 0))
                    let end_work_time_dt = work_time_end_dt(new Date().setTime(dtime));
                    //next time
                    const dt_arr = sortDateTimeArr()
                    if (date in dt_arr) {
                        let times = Object.entries(dt_arr[date])
                        //find next value with disabled and compare with serv_end
                        //if less - ok, if more - not ok: shoose other time
                        for (let index = 0; index < times.length; index++) {
                            // укажем нужный элемент массива дат-времен
                            const elem = times[index];
                            const elem_t = new Date(elem[0]).getTime()

                            if (elem_t === serv_dt_start) {
                                // если след элем == последнему элементу массива - проверим,
                                // что длительность услуги не больше чем конец раб времени
                                let ind = index + 1;
                                if ((ind) === times.length) {
                                    if (serv_dt_end > end_work_time_dt) {
                                        modalAlert(message0);
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
                                        let dis = next[1]
                                        let next_time_dt = new Date(next[0]);
                                        if (dis) {
                                            if (serv_dt_end > next_time_dt) {
                                                modalAlert(message1)
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
            }))
        }
    }
}
/**
 * listener for submit, reset enabled 
 * @param {string} class_for_check 
 */
export function buttonsListener(class_for_check) {
    let mdt = document.querySelector(class_for_check);
    let butdiv = document.getElementById(FormConfig.buttonsDivId);
    let butsubmit = document.getElementById(FormConfig.buttonSubmitId);
    let butreset = document.getElementById(FormConfig.buttonResetId);
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
    })

    butsubmit.addEventListener('click', function () {
        let time_checked = document.querySelectorAll(class_for_check + ' input[name="time"]:checked');
        if (!!time_checked && time_checked.length > 0) {
            document.getElementById(FormConfig.formId).submit();
        }
    })
}