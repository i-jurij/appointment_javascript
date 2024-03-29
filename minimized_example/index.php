<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset='utf-8'>
</head>

<body>

  <?php if (sizeof($_POST) !== 0) : include "./php/postProc.php"; ?>
  <?php else : ?>
    <appointment_tag>
      <?php echo '<style>'; include './style.min.css'; echo '</style>'; ?>
    </appointment_tag>
    <script type="module">
      import { printCalendar } from "./app.min.js";
      let url_for_data_request = 'http://ppntmt-js/php/appointment.php'; 
      let master_id = ''; 
      let service_id = ''; 
      let token = '';
      printCalendar("schedule", url_for_data_request, service_id, master_id, token);
    </script>
  <?php endif; ?>

</body>

</html>