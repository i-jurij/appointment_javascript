/**
* data jbject with calendar settings
*/
export let CalSet = {
    lehgthCal: 24, //for short and month calendar
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

export function setCalsetValue(CalSetFromServer, CalSet) {
    let keys = Object.keys(CalSetFromServer);
    if (!!keys) {
        keys.forEach(function (key) {
            if (CalSet.hasOwnProperty(key)) {
                CalSet[key] = CalSetFromServer[key];
            }
        })
    }
}

/**
 * begins data for html form
 */
export let FormConfig = {
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

}
