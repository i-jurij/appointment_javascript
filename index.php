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
      //type of calendar: "short", "month" or "schedule"
      //appointment("month", ''/path/to/file/on/server'', service_id, master_id, "{{csrf_token()}}");
      appointment("month");
    </script>
    <!-- /// END MODULE /// -->
  <?php endif; ?>

</body>

</html>