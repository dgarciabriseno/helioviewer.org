<?php

function get_changelog_as_list() {
    $changelog = file_get_contents("../changelog.txt");
    return explode("\n", $changelog);
}

function print_changelog() {
    $changes = get_changelog_as_list();
    foreach ($changes as $change) {
        if (!empty($change)) {
            echo "<li>" . substr($change, 2) . "</li>";
        }
    }
}
?>

<div style="text-align: center;">
    <h1 style="font-size: 1.5em">Welcome to the Helioviewer Beta</h1>
    <br/>
    <p>
        Thank you for using the latest build of Helioviewer
        <br/>
        The following updates are currently being staged.
        <br/>
    </p>
</div>
<div style="margin: 0 auto; max-width: 300px;">
    <br/>
    <p>As of <?php echo date("m-d-Y");?>:</p>
    <ul class="changelog" style="margin-left: 15px;">
        <?php print_changelog();?>
    </ul>
</div>
