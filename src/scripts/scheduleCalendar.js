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
            let md = []
            let monthDays = new Date(y, m + 1, 0).getDate()
            for (let i = 1; i <= monthDays; i++) {
                let date = new Date(y, m, i, 0, 0, 0, 0)
                md.push(date)
            }
            return md
        }

        this.next_month = function () {
            if (this.m == 11) {
                this.m = 0
                this.y = this.y + 1
            }
            else {
                this.m = this.m + 1
            }
            return this.current_month()
        }

        this.prev_month = function () {
            if (this.m == 0) {
                this.m = 11
                this.y = this.y - 1
            }
            else {
                this.m = this.m - 1
            }
            return this.current_month()
        }

        this.current_month = function () {
            return this.schedule_get(this.dates(this.y, this.m))
        }

        // таблица для графика работы
        this.schedule_get = function (da) {
            let marked_date_obj = this.Common.markedDates()
            let m = { month: 'long' }
            let y = { year: 'numeric' }
            let holiday = this.Common.holidays()
            let restdays = this.Common.rest_days()
            let dates_arr = Object.keys(marked_date_obj)
            //let date_time_array = this.Common.sortDateTimeArr()
            let date_time_array = this.Common.rest_dt()

            let timess = this.Common.times(Date.now())
            let ti = []
            for (const time in timess) {
                if (Object.hasOwnProperty.call(timess, time)) {
                    const hour = new Date(time).getHours()
                    const min = new Date(time).getMinutes()
                    const t = this.Common.pad(hour) + ':' + this.Common.pad(min)
                    ti.push(t)
                }
            }
            ti.sort()
            //console.log(ti);
            let html = '<div class="clear shed_wrap">\
                        <table class="tc_table">\
                          <thead class=""><tr class="headdate"><th class="tc_td headcol head">&nbsp;</th>'

            let weekend_days = []
            let weekend_times = {}
            for (const [key, value] of Object.entries(this.CalSet.orgWeekend)) {
                if (value === '') {
                    weekend_days.push(`${key}`)
                } else {
                    //weekendtimes
                    weekend_times[key] = value
                }
            }
            //dates out
            for (let index = 0; index < da.length; index++) {
                const date = da[index]
                let dis = (date in marked_date_obj) ? 'tc_' + marked_date_obj[date] : ''
                let mark = (dis === "tc_disabled") ? 'tc_checked' : ''
                if (mark === '' && (weekend_days.includes(this.CalSet.dw[date.getDay()]) || holiday.includes(date.getTime()) || restdays.includes(date.getTime()))) {
                    mark = 'tc_checked'
                }
                html += '<th class="tc_td ' + mark + ' head" id="d_' + new Date(date).getTime() + '">'
                    + this.Common.capitalizeFirstLetter(this.Common.getDayName(date, this.CalSet.locale, this.CalSet.long)) + '<br />' +
                    this.Common.pad(new Date(date).getDate()) + '.' + this.Common.pad(new Date(date).getMonth() + 1) +
                    //(new Date(date).toLocaleDateString(this.CalSet.locale, m) + 'a').replace(/[ьй]а$/, 'я')  + '<br />\
                    '</th>'
            }
            html += '</tr></thead><tbody class="master_times">'
            //console.log(date_time_array)
            //times out
            for (let i = 0; i < ti.length; i++) {
                const time = ti[i]
                const hm = time.split(':')
                html += '<tr class=""><td class="tc_td headcol">' + time + '</td>'
                // цикл по объекту времен, если такой даты нет в массиве времен - для нее вывод времен отдельно
                for (let index = 0; index < da.length; index++) {
                    const t = new Date(new Date(da[index]).setHours(hm[0], hm[1], 0, 0))
                    let mark = ''
                    // check weekend, holiday, full restday
                    if (weekend_days.includes(this.CalSet.dw[da[index].getDay()]) || holiday.includes(da[index].getTime()) || restdays.includes(da[index].getTime())) {
                        mark = 'tc_checked'
                    }
                    if (mark === '' && da[index] in date_time_array) {
                        //check if resttimes
                        const times = date_time_array[da[index]]

                        if (t in times && times[t] === 'disabled') {
                            mark = 'tc_checked'
                        }
                    }
                    //check lunch
                    let lunchh = this.Common.lunch(da[index])
                    let lunchstart_dt = lunchh[0]
                    let lunchend_dt = lunchh[1]
                    if (t >= lunchstart_dt && t < lunchend_dt) {
                        mark = 'tc_checked'
                    }
                    //check if weekend time
                    if (weekend_times.hasOwnProperty(this.CalSet.dw[da[index].getDay()])) {
                        let wt = weekend_times[this.CalSet.dw[da[index].getDay()]].split(':')
                        let weekend_time = new Date(new Date(da[index]).setHours(wt[0], wt[1], 0, 0))
                        if (t.getTime() >= weekend_time.getTime()) {
                            mark = 'tc_checked'
                        }
                    }
                    html += '<td class="' + mark + ' tc_td" id ="d_' + da[index].getTime() + 'dt_' + t.getTime() + '">&nbsp;</td>'
                }
                html += '</tr>'
            }
            html += '   </tbody>\
                    </table>\
                  </div>'
            return html
        }

        this.listener = function () {
            let that = this;
            //schedule output
            let my = { month: 'long', year: 'numeric' }
            let pre_html = '<div class="text_center hor_center schedule_caption">\
                            <span id="btnPre"> < </span>\
                            <span class="month">' + this.Common.capitalizeFirstLetter(new Date(this.y, this.m, 1, 0, 0, 0, 0).toLocaleDateString(this.CalSet.locale, my)).slice(0, -2) + '</span>\
                            <span id="btnNex"> > </span>\
                          </div>\
                          <div id="shed"></div>'
            this.divForTimeChoice.innerHTML = pre_html
            document.querySelector('#shed').innerHTML = this.current_month()
            let sel_nex = document.getElementById('btnNex')
            let sel_pre = document.getElementById('btnPre')
            sel_pre.onclick = function () {
                document.querySelector('#shed').innerHTML = that.prev_month()
                document.querySelector('.month').innerHTML = that.Common.capitalizeFirstLetter(new Date(that.y, that.m, 1, 0, 0, 0, 0).toLocaleDateString(that.CalSet.locale, my)).slice(0, -2)
                that.listener()
            }
            sel_nex.onclick = function () {
                document.querySelector('#shed').innerHTML = that.next_month()
                document.querySelector('.month').innerHTML = that.Common.capitalizeFirstLetter(new Date(that.y, that.m, 1, 0, 0, 0, 0).toLocaleDateString(that.CalSet.locale, my)).slice(0, -2)
                that.listener()
            }
            let now_date = new Date().setHours(0, 0, 0, 0)
            let dnow = document.getElementById("d_" + now_date)
            if (!!dnow) {
                dnow.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
            }

            //add or del hidden inputs for shoosed dates
            document.querySelector('.headdate').addEventListener('click', function (el) {
                let dt = el.target.id
                const times_td = document.querySelectorAll('[id^=' + dt + ']')

                const input_hidden = document.createElement("input")
                input_hidden.type = 'hidden'
                input_hidden.value = dt.slice(2)
                input_hidden.id = 'i' + dt
                let inp = document.querySelector('#' + input_hidden.id)
                if (!!inp) {
                    inp.parentNode.removeChild(inp)
                    if (el.target.classList.contains('tc_mark_for_del')) {
                        el.target.classList.remove('tc_mark_for_del')
                        el.target.classList.add('tc_checked')
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_mark_for_del')
                            elem.classList.add('tc_checked')
                        })
                    }
                    if (el.target.classList.contains('tc_mark_for_add')) {
                        el.target.classList.remove('tc_mark_for_add')
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_mark_for_add')
                        })
                    }
                } else {
                    if (el.target.classList.contains('tc_checked')) {
                        input_hidden.name = 'deldate[]'
                        el.target.classList.remove('tc_checked')
                        el.target.classList.add('tc_mark_for_del')
                        times_td.forEach(function (elem) {
                            elem.classList.remove('tc_checked')
                            elem.classList.add('tc_mark_for_del')
                        })
                    } else {
                        input_hidden.name = 'adddate[]'
                        el.target.classList.add('tc_mark_for_add')
                        times_td.forEach(function (elem) {
                            elem.classList.add('tc_mark_for_add')
                        })
                    }
                    document.querySelector('.shed_wrap').appendChild(input_hidden)
                }
            })

            // add or del hidden inputs for shoosed times
            let now_time = new Date().getTime()
            document.querySelector('.master_times').addEventListener('click', function (element) {
                let tt = element.target.id
                let dt = tt.split('dt_')
                let time = dt[1]

                const input_hidden = document.createElement("input")
                input_hidden.type = 'hidden'
                input_hidden.name = 'deltime[]'
                input_hidden.id = 'dt' + tt
                input_hidden.value = time
                let inp = document.querySelector('#dt' + tt)

                if (!!inp) {
                    inp.parentNode.removeChild(inp)
                    if (element.target.classList.contains('tc_mark_for_del')) {
                        element.target.classList.remove('tc_mark_for_del')
                        element.target.classList.add('tc_checked')
                    }
                    if (element.target.classList.contains('tc_mark_for_add')) {
                        element.target.classList.remove('tc_mark_for_add')
                    }
                } else {
                    if (element.target.classList.contains('tc_checked')) {
                        input_hidden.name = 'deltime[]'
                        element.target.classList.remove('tc_checked')
                        element.target.classList.add('tc_mark_for_del')
                    } else {
                        input_hidden.name = 'daytime[]'
                        element.target.classList.add('tc_mark_for_add')
                    }
                    document.querySelector('.shed_wrap').appendChild(input_hidden)
                }
            })
            // submit, reset listener //
            let reset_button = document.querySelector('#' + that.FormConfig.buttonResetId)
            let submit_button = document.querySelector('#' + that.FormConfig.buttonSubmitId)
            let formmm = document.getElementById(that.FormConfig.formId)
            if (!!formmm) {
                formmm.addEventListener("click", function (element) {
                    if (!!reset_button) { reset_button.disabled = false} 
                    if (!!submit_button) { submit_button.disabled = false} 

                    if (element.target.id == that.FormConfig.buttonResetId) {
                        document.querySelectorAll('.tc_mark_for_add').forEach((item) => {
                            item.classList.remove('tc_mark_for_add')
                        })
                        document.querySelectorAll('.tc_mark_for_del').forEach((item) => {
                            item.classList.remove('tc_mark_for_del')
                            item.classList.add('tc_checked')
                        })
                        document.querySelectorAll('input').forEach((item) => {
                            if (!item.classList.contains('buttons')) {
                                item.remove()
                            }
                        })
                    }

                    if (element.target.id == that.FormConfig.buttonSubmitId) {
                        if (document.querySelectorAll('input').length > 0) {
                            formmm.submit()
                        } else {
                            that.modalAlert('Выберите дату или время');
                        }
                    }
                })
            }
        }
    }
}
export function scheduleCalendar(CalSet, FormConfig, divForTimeChoice, Common, modalAlert) {
    var html = new Schedule(CalSet, FormConfig, divForTimeChoice, Common, modalAlert)
    html.listener()
}