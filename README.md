# Js для вывода времен записи на прием к специалисту

# A js for displaying the time for making an appointment with a specialist.

In "minimized_example" is minimized version with examples files of HTML page and PHP scripts on server.

## Pieces

Type of calendar: "short", "month" or "schedule"  
appointment("month"); - calendar for date of full month  
appointment("short"); - dates only from interval of data_obj.length_cal  
appointment("schedule"); - datetimes for master schedule create

## User interface

Два вида календаря с временами записи к специалисту:  
"short" - даты в количестве, определяемом в настройках в `lehgthCal` и часы записи,  
"month" - календарь на месяц с возможностью переключения месяцев и часы записи,  
"schedule" - таблица с датами в столбцах и временем в строках для планирования выходных дней и часов мастера.

В графике щелчек правой кнопкой мышки:  
на дате выделяет целый день для добавления в выходные, если день уже был помечен как выходной - для удаления из выходных,  
на ячейке с нужными датой-временем - помечает дату-время для добавления в часы отдыха, если время уже было отмечено для отдыха - для удаления из часов отдыха.

## WORK with code

a) If you don't need request to db (eg one service and one master, or one service and the specialist is appointed by the administrator ...)place on page this:

```
<appointment_tag></appointment_tag>
  <script type="module">
    import { printCalendar } from "./appointment/js/importExport.js";
    printCalendar("short");
  </script>
```

b) If you need to query the database to get information about existing records to a specialist for the service, place the following code on the page:

```
<appointment_tag></appointment_tag>
<script type="module">
  import { printCalendar } from "./appointment/js/importExport.js";
  printCalendar("month", url_for_data_request, service_id, master_id, token);
</script>
```

and added style from "src/style.css" to page.

### **Example of full version with URL for DB query and PHP command for include style:**

```
  <?php if (sizeof($_POST) !== 0) : include "build/php/postProc.php"; ?>
  <?php else : ?>
    <appointment_tag><?php echo '<style>'; include 'src/style.css'; echo '</style>'; ?></appointment_tag>
    <script type="module">
      import { printCalendar } from "./src/importExport.js";
      let url_for_data_request = 'http://appointment/build/php/appointment.php';
      let master_id = '';
      let service_id = '';
      let token = '';
      printCalendar("schedule", url_for_data_request, service_id, master_id, token);
    </script>
  <?php endif; ?>
```

Where:  
`let url_for_data_request = 'url_to_file_or_route_on server';` url path to file on server for async fetch request data with calendar settings and records to a specialist;  
`let master_id = '';` eg `master = $('#master').val();`  
`let service_id = '';` eg `service = $('input[type="radio"][name="service"]:checked').val();`  
`let token = '';` for laravel: `<?php echo csrf_token(); ?>` or `"{{csrf_token()}}"` for blade template

### Config

Настройки календаря установлены по умолчанию в "appointment/config.js",  
также могут быть получены с сервера php в формате JSON вместе с данными о записях к специалисту.  
Пример php массива в файле "appointment\\php\\appointment.php".

`endtime = "17:00"`  
Время, после которого даты начинаются с завтрашней (те запись на сегодня уже недоступна)  
The time after which the dates start from tomorrow (those records are no longer available for today)

`lehgthCal = 14`  
Количество отображаемых дней для записи  
The number of days displayed for an appointment

`tz = "Europe/Simferopol"`  
Часовой пояс (в скриптах на данный момент не обрабатывается)  
Timezone (no processing in scripts now)

`period = 60`  
Интервал времен для записи (09:00, 10:00, 11:00, ...),  
мб любой, преобразуется кратно 10,, то есть 7 мин -> 10 мин, 23 мин -> 30 мин и тп  
кроме промежутков > 10, но \< 15 - преобразуется в 15 минутный промежуток  
Time interval for an appointment, can be any, converted multiple of 10  
but if 10 \< $period \< 15 then = 15

`orgWeekend = {'Сб': '14:00', 'Вс': ''}`  
Постоянно планируемые в организации выходные, ключ - название дня,  
значение - пустое, если целый день выходной,  
или время начала отдыха в 24часовом формате HH:mm  
Weekends that are constantly planned in the organization, the key is the name of the day,  
the value is empty if the whole day is off,  
or the start time of the rest in the 24-hour format HH:mm

`holiday = ['2023-02-23', '2023-03-08', '2023-03-17']` - праздничные дни хоть на 10 лет вперед

`lunch = ["12:00", 60]`  
Массив c двумя значениями: время начала HH:mm и длительность обеденного перерыва в минутах  
An array with two values: the start time HH:mm and the duration of the lunch break in minutes

`worktime = ['09:00', '19:00']`  
Рабочее время $worktime\[0\] - начало, $worktime\[1\] - конец  
Working time $worktime\[0\] - start, $worktime\[1\] - end

### Data related to a specific MASTER:

Должны быть получены с сервера в формате JSON.  
Data must be retrieved from server in JSON format.  
`restDayTime = {'2023-03-15': [], '2023-03-13': ['16:00', '17:00', '18:00'],'2023-03-14': ['10:00', '11:00', '14:00'] }`  
Запланированные выходные дни и часы мастера,  
получены из рабочего графика мастера, если массив значений пуст - выходной целый день.  
Значение равно началу времени отгула, длительность не указывается и будет равна $period,  
те, если период = 60 минут, а отсутствовать мастер будет 2 часа после 17:00  
запись такая `restDayTime = {'дата YYYY-mm-dd': ['17:00', '18:00']}`

The scheduled rest days and hours of master,  
are obtained from the master's work schedule, if the array of values is empty - the whole day off.  
The value is equal to the beginning of the time off, the duration is not specified and will be equal to $period,  
those if the period = 60 minutes, and the master will be absent 2 hours after 17:00  
the entry is `restDayTime = {'date YYYY-mm-dd' => ['17:00', '18:00']}`

`existAppDateTimeArr {}`  
Объект предыдущих записей к мастеру в формате

```
{
    'date0': {time0: 'duration0', time1: 'duration1', ...},
    ...,
    'dateN': {timeX: 'durationX', timeY: 'durationY', ...}
}
```

где date - datetime (часы и минуты 00:00)  
а time - datetime (с ненулевым временем): 'duration' - длительность услуги в минутах,  
длительность можно не указывать (null or ''), тогда она считается равной $period

Array of previous entries to the master  
in the array format `{'date': {time: 'duration', ...}, ...)`

Example of original php array for `existAppDateTimeArr {}`:

```
'existAppDateTimeArr' => [
   '2024-03-25' => ['11:00' => '', '13:00' => '', '14:30' => null],
   '2024-03-26' => ['13:00' => '30', '13:30' => '30', '15:00' => 40],
   '2024-03-27' => ['09:00' => '140'],
   '2024-03-28' => ['09:00' => '40', '09:40' => '30', '10:10' => '60'],
]
```

Получить выбранную дату и время для "short" возможно из  
`<input type="hidden" name="date[]" value="js_timestamp" />` и `<input type="radio" name="time" value="js_timestamp" />`,

"month":  
`<input type="radio" name="time" value="js_timestamp" />`,

"schedule":  
`<input type="hidden" name="adddate[]" value="js_timestamp" />` дата для добавления целого дня в выходные дни  
`<input type="hidden" name="deldate[]" value="js_timestamp" />` дата для удаления из выходных дней мастера (кроме выходных дней организации)  
`<input type="hidden" name="daytime[]" value="js_timestamp" />` часы для добавления времени отдыха (обеденное время учитывается отдельно)  
`<input type="hidden" name="deltime[]" value="js_timestamp" />` часы для удаления из часов отдыха

В php скрипте `**unix_timestamp = js_timestamp/1000**`

### **Style**

In directory "build" and  "minimized_example" can be outdated version of "style.css".

The current version of the file is always in the folder "src".

#### PHP

If php is used, css can be included to page like this (default):  
`<appointment_tag><?php echo '<style>'; include 'src/style.css'; echo '</style>'; ?></appointment_tag>`

#### NO PHP

if only javascript is used:

a) rename file "src/style.css" to "src/style.css.js",

b) in "src/ImportExport.js" uncomment `import { cssStyle } from "../style.css.js";`, `insertCss(FormConfig, cssStyle);`, `import { insertCss } from "./scripts/insertCss.js"`,

c) leave the tag "appointment_tag" empty on page `<appointment_tag></appointment_tag>`

#### OPTIMIZE

For style minify i use rollup. Uncomment `import "./style.css";` in "app.js" and run `npm run build`.
