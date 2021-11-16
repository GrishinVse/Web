<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
  
if ($_POST['flag'] == 1) {
  if (is_file('bicycle_parking.json')) {
    $data = file('bicycle_parking.json');
    echo json_encode( $data );
  }
}
?>