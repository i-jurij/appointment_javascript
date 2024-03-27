<?php

/**
 * query to database for settings here 
 * $query = "SELECT * FROM calendar_settings_table";
 * or get data from this file
 */
if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $calSet = [
        /**
         * no required parameters as they setted in config.js
         */
        /*
        'endtime' => '18:00',
        'tz' => 'Europe/Simferopol',
        'orgWeekend' => ['Сб' => '14:00', 'Sat' => '14:00', 'Вс' => '', 'Sun' => ''],
        'restDayTime' => [
            '2024-03-25' => [],
            '2024-03-27' => ['16:00', '17:00', '18:00'],
        ],
        'holiday' => ['2024-02-23', '2024-03-08', '2024-05-01', '2024-06-12', '2024-06-30'],
        'period' => 60,
        'servDuration' => '120',
        'lunch' => ['12:00', 40],
        */
        /**
         * data from db about existed appointment by master or service
         */
        'lehgthCal' => 21,
        'worktime' => ['09:00', '20:00'],
        'existAppDateTimeArr' => [
            '2024-03-25' => ['11:00' => '', '13:00' => '', '14:30' => null],
            '2024-03-26' => ['13:00' => '30', '13:30' => '30', '15:00' => 40],
            '2024-03-27' => ['09:00' => '140'],
            '2024-03-28' => ['09:00' => '40', '09:40' => '30', '10:10' => '60'],
        ]
    ];
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    //header('Access-Control-Expose-Headers: Content-Length');
    echo json_encode($calSet);
    exit;
    //return json_encode($calSet);
}
