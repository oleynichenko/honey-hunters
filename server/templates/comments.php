<?php foreach ($comments as $comment): ?>
	<?=include_template('comment.php', ['comment' => $comment]); ?>
<?php endforeach ?>