<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset='utf-8'>
</head>

<body>

  <?php if (sizeof($_POST) !== 0) : include "build/php/postProc.php"; ?>
  <?php else : ?>
    <!-- /// START MODULE /// -->
    <!-- if php is used, css can be included like this  -->
    <!-- in src/ImportExport.js comment "import { cssStyle } from "./scripts/style.css.js";" and "insertCss(FormConfig, cssStyle);"  -->
    <!-- and "import { insertCss } from "./scripts/insertCss.js";" -->
    <appointment_tag><?php echo '<style>'; include 'src/style.css'; echo '</style>'; ?></appointment_tag>
    <!-- if only javascript is used leave the tag "appointment_tag" empty -->
    <!-- <appointment_tag></appointment_tag> -->

    <script type="module">
      import { printCalendar } from "./src/importExport.js";

      //// WITHOUT DB QUERY ////
      //// eg one service and one master, or one service and the specialist is appointed by the administrator ... ////
      //appointment("schedule");
      //// WITHOUT DB QUERY END ////

      //// WITH DB QUERY ////
      let url_for_data_request = 'http://ppntmt-js/build/php/appointment.php'; // '/path/to/file/on/server/for/request/data/with/calendar/settings'
      let master_id = ''; // eg master = $('#master').val();
      let service_id = ''; // eg service = $('input[type="radio"][name="service"]:checked').val();
      let token = ''; // for laravel: <?php //echo csrf_token(); ?> or "{{csrf_token()}}" for blade template
      //post sql query to db (request to post route url) for get data of calendar by the service and the master
      //and print form for date and time choice
      //type of calendar: "short", "month" or "schedule"
      //printCalendar("short");
      printCalendar("schedule", url_for_data_request, service_id, master_id, token);
      //// WITH DB QUERY END ////
      
    </script>
    <!-- /// END MODULE /// -->
  <?php endif; ?>

</body>

</html>