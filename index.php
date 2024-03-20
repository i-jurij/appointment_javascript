<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset='utf-8'>
</head>

<body>

  <?php if (sizeof($_POST) !== 0) : ?>
    "Get POST data from form"
  <?php else : ?>
    <!-- /// START MODULE /// -->
    <appointment_tag></appointment_tag>
    <script type="module">
      import { appointment } from "./appointment/js/importExport.js";
      //// WITHOUT DB QUERY ////
      //appointment("short");
      /////////////////////////////

      //// WITH DB QUERY ////
      let url_for_data_request = 'http://ppntmt-js/appointment/php/appointment.php'; // '/path/to/file/on/server/for/request/data/with/calendar/settings'
      let master_id = ''; // eg master = $('#master').val();
      let service_id = ''; // eg service = $('input[type="radio"][name="service"]:checked').val();
      let token = ''; // for laravel: <?php //echo csrf_token(); ?> or "{{csrf_token()}}" for blade template
      //// optional part end ////
      //post sql query to db (request to post route url) for get data of calendar by the service and the master
      //and print form for date and time choice
      //type of calendar: "short", "month" or "schedule"
      appointment("month", url_for_data_request, service_id, master_id, token);
      /////////////////////////////

    </script>
    <!-- /// END MODULE /// -->
  <?php endif; ?>

</body>

</html>