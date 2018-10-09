<?php
  function include_template($name, $data) {
    $name = 'templates/' . $name;
    $result = '';

    if (!file_exists($name)) {
        return $result;
    }

    ob_start();
    extract($data);
    require $name;

    $result = ob_get_clean();

    return $result;
  }


  /**
   * Gets comments data from base
   * @param object $con
   *
   * @return array or NULL
   */
  function get_comments($con) {
    $sql = "SELECT * FROM comments ORDER BY id DESC";
    $result = @mysqli_query($con, $sql);

    if(!$result) {
        send_error();
    }

    return mysqli_fetch_all($result, MYSQLI_ASSOC);
  }    


  /**
   * Возвращает соединение к базе данных
   * @return object
   */
  function connect_db($db) {
    $con = @mysqli_connect($db['host'], $db['user'], $db['password'], $db['name']);

    if($con == false) {
      send_error();
    }

    mysqli_set_charset($con, 'utf-8');

    return $con;
  }

  /**
   * Send error message and completes script implemention.
   */
  function send_error() {
      http_response_code(500);      
      $response = array(
        'data' => '',
        'message' => 'Произошла ошибка на сервере. Попробуйте еще раз.'
      );

      print(json_encode($response));
      die;
  }


















  /**
   * Checks errors in posted form fields.
   */
  function validate($comment) {
    $required_fields = ['name', 'email', 'message'];

    foreach($required_fields as $key) {
      if (empty($comment[$key])) {
        return 'Заполните все поля в форме';
      }
    }

    if (!filter_var($comment['email'], FILTER_VALIDATE_EMAIL)) {
      return 'Введите правильный email';
    }  

    return '';
  }

  function saveComment($comment, $con) {
    $name = mysqli_real_escape_string($con, $comment['name']);
    $email = mysqli_real_escape_string($con, $comment['email']);
    $message = mysqli_real_escape_string($con, $comment['message']);

    $sql = "INSERT INTO comments SET
      email = '$email',
      name = '$name',
      message = '$message'";

    $sql_res = mysqli_query($con, $sql);

    if (!$sql_res) {
      send_error();
    }
  }

