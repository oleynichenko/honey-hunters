<section class="cards__item col-lg-4">
	<header class="cards__item-header">
		<h3 class="cards__item-title"><?=htmlspecialchars($comment['name']); ?></h3>
	</header>
	<div class="cards__item-content">
		<p class="cards__item-email"><?=htmlspecialchars($comment['email']); ?></p>
		<p class="cards__item-message"><?=htmlspecialchars($comment['message']); ?></p>
	</div>
</section>	