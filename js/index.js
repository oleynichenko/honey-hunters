(function (){
	const SERVER_URL = "http://jafit.kiev.ua/server/index.php";

	const formErrorClass = "comment__form-item--error";
	const statusErrorClass = "comment__status--error";

	const commentStatus = document.querySelector('.js-comment__status');
	const form = document.querySelector('.js-comment__form');
	const commentBtn = form.querySelector('.js-comment__btn');
	const cardsContainer = document.querySelector('.js-cards__container');

	function isEmailReal(email) {
		const re = /\S+@\S+\.\S+/;
    return re.test(email);
	}

	// при исправлении ошибки в поле формы убираем предыдущее предупреждение
	function controlError(elem) {
    elem.addEventListener("blur", function(event) {
      if(this.value) { 
        elem.parentElement.classList.remove(formErrorClass);
      }

    }, true);  
  };

  function showStatusError() {
  	commentStatus.classList.add(statusErrorClass);
  }

	function showFormError(elem) {
		elem.parentElement.classList.add(formErrorClass);
	}

	// Проверяем валидность заполненных полей формы
	function validateForm(form) {
		const elems = form.elements;
		let noErrors = true;

		const name = elems.name;
		if (!name.value) {
			showFormError(name);
			controlError(name);

			noErrors = false;
		}

		const email = elems.email;
		if (!isEmailReal(email.value)) {
			showFormError(email);
			controlError(email);

			noErrors = false;
		}
		
		const message = elems.message;
		if (!message.value) {
			showFormError(message);
			controlError(message);

			noErrors = false;
		}

		return noErrors;
	}

	// Публикуем коммментарий
	function publishComment(form) {
		
		// делаем кнопку отправки формы неактивной
		commentBtn.disabled = true;

		if (validateForm(form)) {
			const formData = new FormData(form);

			const xhr = new XMLHttpRequest();
			xhr.open("POST", SERVER_URL, true);
    	xhr.send(formData);

    	xhr.onreadystatechange = function () {
	  		if (xhr.readyState != 4) return;

	  		const response = JSON.parse(xhr.responseText);
	  		let message = response.message;
	  		const data = response.data;

	    	if (xhr.status === 200) {

	    		// публикуем комментарий
		    	pasteCard(data);

		    	// очищаем поля формы
		    	form.reset();
	    	} else {
	    		if (!message) {
						message = "Произошла непредвиденная ошибка. Попробуйте еще раз."
	    		}
	    		
	    		// готовим блок к показу сообщения об ошибке
	    		commentStatus.classList.add(statusErrorClass);
	    	}

	    	commentStatus.innerHTML = message;
	    	commentBtn.disabled = false;	
    	}
		} else {
			// делаем кнопку отправки формы активной	
			commentBtn.disabled = false;
		}
	}

	function pasteCard (cardData) {
		cardsContainer.insertAdjacentHTML("afterBegin", cardData);
	}

	function pasteCards(cardsData) {
		cardsContainer.innerHTML = cardsData;
	}

	function showCards() {
		const xhr = new XMLHttpRequest();

		xhr.open("GET", SERVER_URL, true);
  	xhr.send();

  	xhr.onreadystatechange = function () {
  		if (xhr.readyState != 4) return;

    	if (xhr.status === 200) {
    		const cardsData = JSON.parse(xhr.responseText).data;
	    	pasteCards(cardsData);
    	} 		
  	}
	}

	// обработываем клик по кнопке отправки формы
	commentBtn.addEventListener("click", (event) => {
		event.preventDefault();
		publishComment(form);
	});

	// при фокусе на любое поле ввода убираем сообщение в commentStatus от предыдущего комментария
	[].forEach.call(form.elements, function(elem) {
		elem.addEventListener("focus", function () {
			if (commentStatus.innerHTML !== '') {
				commentStatus.innerHTML = '';
				commentStatus.classList.remove(statusErrorClass);
			}			
		})
	});

	// Показываем комментарии из базы данных
	showCards();
})();