# Js для вывода времен записи на прием к специалисту   
# A js for displaying the time for making an appointment with a specialist.   

## Config  
Не требует входных параметров (установлены по умолчанию в "appointment/config.js"),  
настройки календаря могут быть получены с сервера php в формате JSON, пример в файле   
"appointment\php\appointment.php".   

`data_obj.endtime = "17:00"`   
Время, после которого даты начинаются с завтрашней (те запись на сегодня уже недоступна)   
The time after which the dates start from tomorrow (those records are no longer available for today)   

`data_obj.lehgth_cal = 14`   
Количество отображаемых дней для записи   
The number of days displayed for an appointment   

`data_obj.tz = "Europe/Simferopol"`   
Часовой пояс (в скриптах на данный момент не обрабатывается)   
Timezone (no processing in scripts now)   

`data_obj.period = 60`   
Интервал времен для записи (09:00, 10:00, 11:00, ...),   
мб любой, преобразуется кратно 10,, то есть 7 мин -> 10 мин, 23 мин -> 30 мин и тп      
кроме промежутков > 10, но < 15 - преобразуется в 15 минутный промежуток   
Time interval for an appointment, can be any, converted multiple of 10   
but if 10 < $period < 15 then = 15   

`data_obj.org_weekend = {'Сб': '14:00', 'Вс': ''}`   
Постоянно планируемые в организации выходные, ключ - название дня,   
значение - пустое, если целый день выходной,   
или время начала отдыха в 24часовом формате HH:mm   
Weekends that are constantly planned in the organization, the key is the name of the day,   
the value is empty if the whole day is off,   
or the start time of the rest in the 24-hour format HH:mm   

`data_obj.holiday = ['2023-02-23', '2023-03-08', '2023-03-17']` - праздничные дни хоть на 10 лет вперед   

`data_obj.lunch = ["12:00", 60]`   
Массив c двумя значениями: время начала HH:mm и длительность обеденного перерыва в минутах   
An array with two values: the start time HH:mm and the duration of the lunch break in minutes   

`data_obj.worktime = ['09:00', '19:00']`   
Рабочее время $worktime[0] - начало, $worktime[1] - конец   
Working time $worktime[0] - start, $worktime[1] - end   

### DATA related to a specific MASTER:   
Могут быть получены с сервера в формате JSON.   
Data can be retrieved from server in JSON format.   
`data_obj.rest_day_time = {'2023-03-15': [], '2023-03-13': ['16:00', '17:00', '18:00'],'2023-03-14': ['10:00', '11:00', '14:00'] }`   
Запланированные выходные дни и часы мастера,   
получены из рабочего графика мастера, если массив значений пуст - выходной целый день.   
Значение равно началу времени отгула, длительность не указывается и будет равна $period,   
те, если период = 60 минут, а отсутствовать мастер будет 2 часа после 17:00   
запись такая `rest_day_time = {'дата YYYY-mm-dd': ['17:00', '18:00']}`   

The scheduled rest days and hours of master,  
are obtained from the master's work schedule, if the array of values is empty - the whole day off.   
The value is equal to the beginning of the time off, the duration is not specified and will be equal to $period,   
those if the period = 60 minutes, and the master will be absent 2 hours after 17:00   
the entry is `rest_day_time = {'date YYYY-mm-dd' => ['17:00', '18:00']}`   

`data_obj.exist_app_date_time_arr`   

Объект предыдущих записей к мастеру   
в формате `{'date': {time: 'duration', ...}, ...)`,   
где date - datetime (часы и минуты 00:00)   
а time - datetime (с ненулевым временем): 'duration' - длительность услуги в минутах,   
длительность можно не указывать (null or ''), тогда она считается равной $period   

Array of previous entries to the master   
in the array format `{'date': {time: 'duration', ...}, ...)`   
Получить выбранную дату и время возможно из    
`<input type="radio" name="time" value="js_timestamp" />` или    
`<input type="hidden" name="deldate[]" value="js_timestamp" />`   
`<input type="hidden" name="date[]" value="js_timestamp" />`   
`<input type="hidden" name="deltime[]" value="js_timestamp" />`   
`<input type="hidden" name="daytime[]" value="js_timestamp" />`,   
соответственно:   
`$_POST["time"];$_POST["deldate"]; $_POST["time"]; $_POST["time"]; $_POST["time"];`    
В php скрипте unix_timestamp = js_timestamp/1000   

## CONNECT    
```
    <!-- /// START MODULE /// -->
    <appointment_tag></appointment_tag>
    <script type="module">
      import { appointment } from "./appointment/js/importExport.js";
      //type of calendar: "short", "month" or "schedule"
      //appointment("month", ''/path/to/file/on/server'', service_id, master_id, "{{csrf_token()}}");
      appointment("month");
    </script>
    <!-- /// END MODULE /// -->
```   

## Pieces
type of calendar: "short", "month" or "schedule"   
appointment("month"); - calendar for date of full month   
appointment("short"); - dates only from interval of data_obj.length_cal   
appointment("schedule"); - datetimes for master schedule create
