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
        var d = new Date()
            // Первый день недели в выбранном месяце
            , firstDayOfMonth = new Date(y, m, 7).getDay()
            // Последний день выбранного месяца
            , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
            // Последний день предыдущего месяца
            , lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
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
                var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                for (var j = 0; j < firstDayOfMonth; j++) {
                    //html += '<td class="not-current td_month_cal">' + k + '</td>';
                    html += '<td class="not-current td_month_cal"></td>';
                    k++;
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
                var k = 1;
                for (dow; dow < 7; dow++) {
                    //html += '<td class="not-current td_month_cal">' + k + '</td>';
                    html += '<td class="not-current td_month_cal"></td>';
                    k++;
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
        let d_div = document.querySelector('#tableId > tbody')
        let that = this;
        if (!!d_div) {
            d_div.addEventListener('click', function (ev) {
                that.ServDurationCheck.servDurationF();
            })
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

export function monthCalendar(Common, CalSet, divForTimeChoice, ServDurationCheck) {
    // OUTPUT MONTH CALENDAR
    let pre_html = '<button id="btnPrev" type="button"> < Предыдущий</button>\
                <button id="btnNext" type="button">Следующий > </button>\
                <div id="divCal"></div>\
                <div id="divTimes"></div>';
    divForTimeChoice.classList.add('calendar-wrapper')
    divForTimeChoice.innerHTML = '<h3 class="back shad rad pad margin_rlb1">Выберите дату и время</h3>' + pre_html
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