module.exports = formation;

function formation(element, options) {
	if (!(this instanceof formation)) return new formation(element, options);
	function extend(a, b){
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this.defaults = {
		forwardSectionExitAnimation: 'rotateOutUpRight',
		forwardSectionEntranceAnimation: 'rotateInUpLeft',
		backwardSectionExitAnimation: 'rotateOutUpLeft',
		backwardSectionEntranceAnimation: 'rotateInDownRight',
		forwardExitAnimation: 'fadeOutUpBig',
		forwardEntranceAnimation: 'fadeInUpBig',
		backwardExitAnimation: 'fadeOutDownBig',
		backwardEntranceAnimation: 'fadeInDownBig',
		addNavigationControls: true,
		height: 'auto',
		width: '100%',
		startIndex: 0,
		animationSpeed: 500
	};
	this.element = element;
	this.options = extend(this.defaults, this.options);
	if (this.options.name) {
		this.name = this.options.name;
	} else if (this.element.getAttribute('id') !== null) {
		this.name = this.element.getAttribute('id');
	} else {
		this.name = (Math.floor((Math.random()*100)+1)).toString(); 
	}
	this.create();
}
formation.prototype.create = function () {
	var formation = this;	
	this.element.className = this.element.className + ' formation';
	this.element.setAttribute('data-formation-name', this.name);
	this.element.setAttribute('style', 'height: ' + this.options.height + '; width: ' + this.options.width + ';');
	[].forEach.call(this.element.querySelectorAll('section, fieldset'), function (item) {
		if (item.tagName.toLowerCase() === 'fieldset') {
			item.className = item.className + ' formation-field animated';
		} else {
			item.className = item.className + ' formation-section animated';
		}
		item.setAttribute('style', '-webkit-animation-duration: ' + (formation.options.animationSpeed / 1000) + ';' + '-moz-animation-duration: ' + (formation.options.animationSpeed / 1000) + ';' + '-o-animation-duration: ' + (formation.options.animationSpeed / 1000) + ';' + '-animation-duration: ' + (formation.options.animationSpeed / 1000) + ';');
	});
	this.element.querySelector('fieldset').className = this.element.querySelector('fieldset').className + ' current ' + this.options.forwardSectionEntranceAnimation;
	[].forEach.call(this.element.querySelectorAll('fieldset'), function (field, index) {
		field.setAttribute('data-formation-field-index', index);	
	});
	if (this.element.querySelector('section')) {
		this.element.querySelector('section').className = this.element.querySelector('section').className + ' current ' + this.options.forwardSectionEntranceAnimation;
		[].forEach.call(this.element.querySelectorAll('section'), function (section, index) {
			section.setAttribute('data-formation-section-index', index);	
		});
	}
	if (this.options.addNavigationControls) {
		this._createNav();
	}
}
formation.prototype._move = function (direction) {
	var index,
	destinationIndex,
	exitAnimation,
	func,
	entranceAnimation;
	var formation = this.element;
	index = parseInt(formation.querySelector('fieldset.current').getAttribute('data-formation-field-index'), 10);
	console.log(index);
	// if (!direction || direction === 'forward') {
	// 	direction = 'forward';
	// 	func = 'next';
	// 	destinationIndex = index + 1;
	// 	exitAnimation = options.forwardExitAnimation;
	// 	entranceAnimation = options.forwardEntranceAnimation;
	// }
	// else if (direction === 'backward') {
	// 	destinationIndex = index - 1;
	// 	func = 'prev';
	// 	exitAnimation = options.backwardExitAnimation;
	// 	entranceAnimation = options.backwardEntranceAnimation;
	// } else if (typeof(direction) === 'number') {
	// 	destinationIndex = direction;
	// }
	// if (index !== destinationIndex && destinationIndex >= 0 && $formation.find('[data-formation-field-index="' + destinationIndex + '"]').length > 0) {
	// 	this.resetAnimation();
	// 	var $currentField = $formation.find('fieldset.current');
	// 	var $currentSection = $formation.find('section.current');
	// 	// var $currentSection = $currentField.parent();or this.
	// 	if (typeof(direction) === 'number') {
	// 		//need to move to a number and calculate whether it is in the same section or not we could actually do this in the other part probably lets take a lok
	// 		if ($currentField.siblings('[data-formation-field-index="' + destinationIndex + '"]').length > 0) {
	// 			//then just show the correct field without doing a section move.
	// 			if (index < destinationIndex) {
	// 				//we are going forwards

	// 				//TODO: there must be a way of refactoring this so that the actual change over isn't duplicated everywhere, lets make a function for this and pass in say exitAnimation, destinationIndex and entranceAnimation and speed maybe because it's duplicated everywhere.
	// 				$currentField.addClass(exitAnimation);
	// 				setTimeout(function () {
	// 					$currentField.removeClass('current');
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').addClass(entranceAnimation + ' current');
	// 				}, options.animationSpeed);
	// 			} else {
	// 				// we are going backwards.
	// 				$currentField.addClass(exitAnimation);
	// 				setTimeout(function () {
	// 					$currentField.removeClass('current');
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').addClass(entranceAnimation + ' current');
	// 				}, options.animationSpeed);
	// 			}
	// 		} else {
	// 			if (index < destinationIndex) {
	// 				$currentSection.addClass(options.forwardSectionExitAnimation);
	// 				//see if we don't have to touch this part
	// 				$currentField.addClass(exitAnimation);
	// 				setTimeout(function () {
	// 					$currentField.removeClass('current');
	// 					// we can actually pass in section as an option of the function then it only does this line if necessary
	// 					$currentSection.removeClass('current');
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').parent('section').addClass(options.forwardSectionEntranceAnimation + ' current');
	// 					//this bit would be bunched.
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').addClass(entranceAnimation + ' current');
	// 				}, options.animationSpeed);
	// 				/////
	// 			} else {
	// 				$currentSection.addClass(options.backwardSectionExitAnimation);
	// 				//see if we don't have to touch this part
	// 				$currentField.addClass(exitAnimation);
	// 				setTimeout(function () {
	// 					$currentField.removeClass('current');
	// 					// we can actually pass in section as an option of the function then it only does this line if necessary
	// 					$currentSection.removeClass('current');
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').parent('section').addClass(options.backwardSectionEntranceAnimation + ' current');
	// 					//this bit would be bunched.
	// 					$('fieldset[data-formation-field-index="' + destinationIndex + '"]').addClass(entranceAnimation + ' current');
	// 				}, options.animationSpeed);
	// 				/////
	// 			}
	// 			// you've got to go to another section and we need to know which way.
	// 		}
	// 	} else {
	// 		if ($currentField[func]('fieldset').length > 0) { // we are just navigating to the next field so nothing crazy
	// 			$currentField.addClass(exitAnimation);
	// 			setTimeout(function () {
	// 				$currentField.removeClass('current');
	// 				$currentField[func]('fieldset').addClass(entranceAnimation + ' current');
	// 			}, options.animationSpeed);

	// 		} else {
	// 			console.log('the field is in another section so we need to nagifate to there.');
	// 			$currentSection.addClass(options.forwardSectionExitAnimation);
	// 			$currentField.addClass(options.forwardSectionExitAnimation)
	// 			setTimeout(function () {
	// 				$currentSection.removeClass('current');
	// 				$currentField.removeClass('current');
	// 				$currentSection[func]('section').addClass(options.forwardSectionEntranceAnimation + ' current');
	// 				$currentSection[func]('section').find('fieldset').first().addClass('current ' + options.forwardSectionEntranceAnimation);
	// 			}, options.animationSpeed);
	// 		}
	// 	}
	// } else if (direction === 'forward' && options.submitFunction) {
	// 	options.submitFunction();
	// } 
	//TODO: properly implement goToIndex as this is currently not working as we need to work out where it is if it requires going to another section etc.

}
formation.prototype.resetAnimation = function () {
	// var regex = new RegExp('blue|' + string, 'gi');
	// var n=str.replace(regex,"BLACK");
	var regex = new RegExp(this.options.forwardExitAnimation + '|' + this.options.forwardEntranceAnimation + '|' + this.options.backwardEntranceAnimation + '|' + this.options.backwardExitAnimation + '|' + this.options.forwardSectionEntranceAnimation + '|' + this.options.forwardSectionExitAnimation + '|' + this.options.backwardSectionEntranceAnimation + '|' + this.options.backwardSectionExitAnimation, 'gi');
	[].forEach.call(this.element.querySelectorAll('section, fieldset'), function (item) {
		item.className = item.className.replace(regex, '');
	});
}
formation.prototype.goForward = function () {

}
formation.prototype.goBackward = function () {

}
formation.prototype.goToIndex = function () {

}
formation.prototype._createNav = function () {
	var formation = this;
	var controlsHolder = document.createElement('div');
	controlsHolder.className = 'formation-nav-ctrls';
	var next = document.createElement('button');
	next.setAttribute('data-formation-next', true);
	next.innerText = 'Next';
	next.addEventListener('click', function () {
		formation._move('forward');
	});
	var previous = document.createElement('button');
	previous.setAttribute('data-formation-previous', true);
	previous.innerText = 'Previous';
	previous.addEventListener('click', function () {
		formation._move('backward');
	});
	controlsHolder.appendChild(next);
	controlsHolder.appendChild(previous);
	this.element.appendChild(controlsHolder);
}
formation.prototype.val = function () {

}
