<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset='utf-8'>
</head>

<body>

  <appointment_tag>
    <?php echo '<style>'; include './style.css'; echo '</style>'; ?>
  </appointment_tag>
  <script type="module">
    import { printCalendar } from "./app.js";
    let url_for_data_request = '';
    let master_id = '';
    let service_id = '';
    let token = '';
    printCalendar("schedule", url_for_data_request, service_id, master_id, token);
  </script>

</body>

</html>