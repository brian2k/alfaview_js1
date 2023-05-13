<?php
$myPost = file_get_contents('php://input');
$action = $_GET['action'];

$filename = '../gastro/data/' . $action . '.json';

if (!file_exists($filename)) {
    file_put_contents($filename, $myPost);
} else {
    $myFile = fopen($filename, 'w');
    fwrite($myFile,$myPost);
    fclose($myFile);
}
echo $myPost;
?>