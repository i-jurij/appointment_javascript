export class ServDurationCheck {
    constructor(CalsetUpdated, FormConfig, divForTimeChoice, Common, modalAlert) {
        this.divForTimeChoice = divForTimeChoice
        this.FormConfig = FormConfig
        this.Calset = CalsetUpdated
        this.Com = Common
        this.modalAlert = modalAlert
    }

    /**
     * CHECK IF SERV DURATION < time interval between appointment times
     */
    servDurationF() {
        let message0 = ' Недостаточно времени для оказания услуги до конца рабочего дня.\n<br /> Пожалуйста, выберите другое время.';
        let message1 = ' Недостаточно свободного времени для оказания услуги.\n<br /> Пожалуйста, выберите другое время.';
        let butsubmit = document.getElementById(this.FormConfig.buttonSubmitId);

        const dur = this.Calset.servDuration
        if (!!this.divForTimeChoice) {
            let t_div = document.querySelectorAll('.master_times')
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
                        const date = new Date(new Date(serv_dt_start).setHours(0, 0, 0, 0))
                        let end_work_time_dt = that.Com.work_time_end_dt(new Date().setTime(dtime));
                        //next time
                        const dt_arr = that.Com.sortDateTimeArr()
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
                                            let dis = next[1]
                                            let next_time_dt = new Date(next[0]);
                                            if (dis) {
                                                if (serv_dt_end > next_time_dt) {
                                                    that.modalAlert(message1)
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
}