<?php 
	require_once('functions.php');
	$db = require_once('database.php');

	header('Access-Control-Allow-Origin: *');
	$con = connect_db($db);

	$response = array('data' => '', 'message' => '');

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$comment = $_POST;		
		$error = validate($comment);

		if (empty($error)) {
			saveComment($comment, $con);

			$response['data'] = include_template('comment.php', ['comment' => $comment]);
			$response['message'] = 'Комментарий успешно опубликован!'; 
		} else {
			http_response_code(500); 
			$response['message'] = $error;
		}

	} else {
		$comments = get_comments($con);
		$response['data'] = include_template('comments.php', ['comments' => $comments]);

	}

	print(json_encode($response));
