<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_POST['flag'] == 0) {
  if (isset($_POST['text'])) {
    $data = fopen('data.json', 'w');
    $n = strlen($_POST['text']);
    fputs($data, $_POST['text']);
    fclose($data);
  }
}
  
if ($_POST['flag'] == 1) {
  if (is_file('data.json')) {
    $data = file('data.json');
    echo json_encode( $data );
  }
}
?>