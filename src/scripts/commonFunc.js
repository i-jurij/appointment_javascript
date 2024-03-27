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
export class CommonFunc {
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
            dt.setHours(0, 0, 0, 0)
            arr.push(new Date(dt));
        }
        return arr;
    }

    work_time_start_dt(data) {
        const work_time_start = this.Calset.worktime[0].split(':')
        const wksdt = new Date(data).setHours(work_time_start[0], work_time_start[1])
        return wksdt
    }

    work_time_end_dt(data) {
        const work_time_end = this.Calset.worktime[1].split(':')
        const wkedt = new Date(data).setHours(work_time_end[0], work_time_end[1])
        return wkedt
    }

    /** 
     * get name of day of week
     */
    getDayName(dateStr, locale, long) {
        if (!dateStr) dateStr = new Date()
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: long });
    }

    round_period(CalSet_period) {
        let rp;
        if (CalSet_period < 10) {
            rp = CalSet_period * 60
        } else {
            rp = (CalSet_period > 5 && CalSet_period < 16) ? 15 : Math.ceil(Number(CalSet_period / 10)) * 10
        }
        return rp;
    }

    lunch(datetime_string) {
        const dt = (datetime_string) ? new Date(datetime_string) : new Date();
        let lunch_array = []
        const lunch_arr = this.Calset.lunch[0].split(':')
        const lunch_hour = lunch_arr[0]
        const lunch_min = lunch_arr[1]
        const lunch_dur = this.Calset.lunch[1]
        const lunchstart_dt = new Date(new Date(datetime_string).setHours(lunch_hour, lunch_min, 0, 0));
        const lunchend_dt = this.dateAdd(lunchstart_dt, 'minute', lunch_dur)
        return lunch_array = [lunchstart_dt, lunchend_dt]
    }

    /**
     * get all dates for processing
     */
    all_dates() {
        let start = Date.now()
        let end = (new Date()).setDate((new Date()).getDate() + (this.Calset.lehgthCal - 1))
        let res = this.getDaysArray(start, end)

        let now = new Date()
        let tm = this.Calset.endtime.split(":")
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
        var restdays = []
        for (const key in this.Calset.restDayTime) {
            if (Object.hasOwnProperty.call(this.Calset.restDayTime, key)) {
                const dt = new Date(key)
                dt.setHours(0, 0, 0, 0)
                const element = this.Calset.restDayTime[key];
                if (element.length <= 0) {
                    //restdays.push(key)
                    let date = new Date(key).setHours(0, 0, 0, 0)
                    restdays.push(date)
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
            let el = '';
            const year = element.getFullYear();
            const month = element.getMonth();
            const day = element.getDate();
            const Yearmonthday = year + "-" + this.pad((month + 1)) + "-" + this.pad(day);

            //if date is holiday - mark it
            //const hol = holiday.find(date => date.toDateString() === element.toDateString());
            const hol = (holiday) ? holiday.includes(element.getTime()) : [];
            if (hol) {
                days[element] = "disabled";
                //div_cont.innerHTML = div_cont.innerHTML + dateArray[index] +'\n<br>';
                continue;
            }

            //if name of day of week existed in CalSet.orgWeekend - mark it
            const name_of_day = this.getDayName(element, this.Calset.locale, this.Calset.long)
            const cnd = this.capitalizeFirstLetter(name_of_day)
            if (((name_of_day in this.Calset.orgWeekend)
                && (this.Calset.orgWeekend[name_of_day] === '' || this.Calset.orgWeekend[name_of_day] === null))
                || ((cnd in this.Calset.orgWeekend) && (this.Calset.orgWeekend[cnd] === '' || this.Calset.orgWeekend[cnd] === null))
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
        return days;
    }

    /**
     * times for date
     */
    times(datestring) {
        const period = this.round_period(this.Calset.period)
        const dt = (datestring) ? new Date(datestring) : new Date();
        const year = dt.getFullYear();
        const month = dt.getMonth();
        const day = dt.getDate();

        let lunchh = this.lunch(datestring)
        let lunchstart_dt = lunchh[0]
        let lunchend_dt = lunchh[1]

        let times = {}

        let startt = this.Calset.worktime[0].split(':')
        let endd = this.Calset.worktime[1].split(':')
        const start = new Date(year, month, day, startt[0], startt[1], 0, 0);
        const end = new Date(year, month, day, endd[0], endd[1], 0, 0);
        for (let index = start; index < end; index = this.dateAdd(index, 'minute', period)) {
            if (index < lunchstart_dt || index >= lunchend_dt) {
                times[index] = ''
                //console.log(this.pad(hours)+':'+this.pad(min))
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

    /**
     * ALL DATE_TIMES
     */
    date_times() {
        let marked_date_obj = this.markedDates();
        let dt = {}
        for (const date in marked_date_obj) {
            if (Object.hasOwnProperty.call(marked_date_obj, date)) {
                const mark_d = marked_date_obj[date];
                if (mark_d === '' || mark_d === 'checked') {
                    dt[date] = this.times(date)
                    //console.log(dt[date])
                }
            }
        }
        return dt
    }

    rest_dt() {
        let period = this.round_period(this.Calset.period)
        // create object with rest times
        let rest_times = {}
        for (const date in this.Calset.restDayTime) {
            if (Object.hasOwnProperty.call(this.Calset.restDayTime, date)) {
                const element = this.Calset.restDayTime[date];
                if (element.length > 0) {
                    rest_times[date] = {}
                    for (let i = 0; i < element.length; i++) {
                        const el = element[i];
                        const h_m_t = el.split(':')
                        const h = h_m_t[0]
                        const m = h_m_t[1]
                        const start = new Date(new Date(date).setHours(h, m, 0, 0))
                        const end = new Date(this.dateAdd(new Date(start), 'minute', period).getTime())
                        rest_times[date][start] = 'disabled'
                        if (end < this.work_time_end_dt(date)) {
                            if (!(end in rest_times[date])) {
                                rest_times[date][end] = ''
                            }
                        }
                    }
                }
            }
        }
        //console.log(rest_times)
        let dt = this.date_times()
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
        return dt;
    }

    appTimes() {
        let period = this.round_period(this.Calset.period);
        //create appointment object from CalSet.existAppDateTimeArr
        let date_time = this.rest_dt()
        let exist_app_date_time_obj = {}
        let start_end = {}
        for (const data in this.Calset.existAppDateTimeArr) {
            if (Object.hasOwnProperty.call(this.Calset.existAppDateTimeArr, data)) {
                const dt = new Date(new Date(data).setHours(0, 0, 0, 0))
                exist_app_date_time_obj[dt] = {}
                start_end[dt] = []

                const times = this.Calset.existAppDateTimeArr[data];
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
                            app_end = this.dateAdd(app_start, interval, serv_dur)
                        } else {
                            app_end = this.dateAdd(app_start, 'minute', period);
                        }
                        exist_app_date_time_obj[dt][app_start] = 'disabled'
                        start_end[dt].push([app_start, app_end])

                        if (app_end < this.work_time_end_dt(dt)) {
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
        return date_time;
    }

    weekend_times() {
        // use appa_times as date_times without rest days
        let date_time = this.appTimes()
        let h_m = ''

        for (const date in date_time) {
            const dt_times = date_time[date];
            const name_of_day = this.getDayName(new Date(date), this.Calset.locale, this.Calset.long)
            const cnd = this.capitalizeFirstLetter(name_of_day)

            let z1 = name_of_day in this.Calset.orgWeekend
            let z2 = cnd in this.Calset.orgWeekend
            if (z1 && (this.Calset.orgWeekend[name_of_day] !== '' || this.Calset.orgWeekend[name_of_day] !== null)) {
                h_m = this.Calset.orgWeekend[name_of_day].split(':')
            } else if (z2 && (this.Calset.orgWeekend[cnd] !== '' || this.Calset.orgWeekend[cnd] !== null)) {
                h_m = this.Calset.orgWeekend[cnd].split(':')
            }
            if ((z1 || z2) && h_m !== '') {
                const hour = h_m[0]
                const min = h_m[1]
                const week_start = new Date(new Date(date).setHours(hour, min, 0, 0))
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
        let date_time = this.weekend_times()
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
        })

        butsubmit.addEventListener('click', function () {
            let time_checked = document.querySelectorAll(class_for_check + ' input[name="time"]:checked');
            if (!!time_checked && time_checked.length > 0) {
                document.getElementById(that.FormConfig.formId).submit();
            }
        })
    }
}