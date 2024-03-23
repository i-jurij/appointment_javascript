<?php
if (!empty($_POST['time'])) {
    if (!empty($_POST['date'])) { ?>
        "POST data from short calendar"<br/>
    <?php } else { ?>
        "POST data from month calendar"<br/>
    <?php }
}

if (!empty($_POST['adddate']) || !empty($_POST['deldate']) || !empty($_POST['daytime']) || !empty($_POST['deltime'])) { ?>
    "POST data from schedule calendar"<br/>
<?php }

print_r($_POST);
?>