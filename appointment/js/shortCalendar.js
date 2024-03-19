import { CalSet, FormConfig, Common } from "./importExport.js";
// short calendar
var Short = function () {
    var marked_date_obj = Common.markedDates();
    let dates_arr = Object.keys(marked_date_obj);
    let date_time_array = Common.sortDateTimeArr();

    //console.log(dates_arr);
    //let options = { weekday: 'short', month: 'short', day: 'numeric' };
    let options = { month: 'short' };
    let view = '<div class="master_datetime">'
    var formatted = dates_arr.map(item =>
        '<div class="master_date">\
              <input type="radio" class="dat" id="d_'+ new Date(item).getTime() + '" name="date" value="' + new Date(item).getTime() + '" ' + marked_date_obj[item] + ' required />\
              <label for="d_'+ new Date(item).getTime() + '" class="dat_label">'
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
            view += '</div> '
        }
    }
    view += '</div> '
    //document.querySelector('#content').innerHTML = formatted.join('') + view;
    if (!!Common.divShort) {
        Common.divShort.innerHTML = view;
    }
}

Short.prototype.listener = function () {
    let tc = document.querySelector(".dat:checked");
    let id = (!!tc) ? tc.id : false;
    let div_for_time = document.querySelector('#t' + id);

    if (!!div_for_time) { div_for_time.style.display = "block" }

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
    Common.servDurationF(); 
    //listener for submit, reset activate
    let class_for_check = '.master_datetime';
    Common.buttonsListener(class_for_check);
}

export function shortCalendar() {
    var html_short = new Short();
    html_short.listener();
}