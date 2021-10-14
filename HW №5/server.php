<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if (isset($_POST['text'])) {
  $data = fopen('data.json', 'w');
  fputs($data, $_POST['text']);
  fclose($data);
  if (is_file('data.json')) {
    $data = file('data.json');
    echo json_encode( $data );
    exit();
  }
}
?>