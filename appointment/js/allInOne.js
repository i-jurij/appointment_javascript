import { FormConfig, monthCalendar, shortCalendar, scheduleCalendar } from "./importExport.js";
export function allInOne(calendar, formAction = "") {
    
    if (calendar === 'short') {
        shortCalendar();
    }
    if (calendar === 'schedule') {
        scheduleCalendar()
    }
    if (calendar === 'month') {
        monthCalendar();
    }
}