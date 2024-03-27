export class AllInOne {
    constructor(CalSetUpdated, FormConfig, divForTimeChoice, CommonFunc, modalAlert, ServDurationCheck, shortCalendar, monthCalendar, scheduleCalendar) {
        this.CalSetUpdated = CalSetUpdated; 
        this.FormConfig = FormConfig; 
        this.divForTimeChoice = divForTimeChoice;
        this.CommonFunc = CommonFunc;
        this.modalAlert = modalAlert
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
            this.scheduleCalendar(this.CalSetUpdated, this.FormConfig, this.divForTimeChoice, this.CommonFunc, this.modalAlert)
        }
        if (calendar === 'month') {
            this.monthCalendar(this.CommonFunc, this.CalSetUpdated, this.divForTimeChoice, this.ServDurationCheck);
        }
    }
}