# formation

  A configurable animated form component compatible with [component](https://github.com/component/component) package manager. Enables developer to animate journey through a form from start to finish using CSS3 animations. Extra animations can be defined by user but [animate](https://github.com/daneden/animate.css) has been used to develop with. A component package manager version of [animate.css](http://github.com/jheytompkins/animate) has been used as a dependency with formation to get new users up and running quickly.

## Demo

A simple demo of formation can be seen [here](http://jsfiddle.net/3ZPgv/5/).

## Installation

  Install with [component(1)](https://github.com/component/component):

    $ component install jheytompkins/formation


## Use

Include necessary script and style files and simply do as in the [example page](https://github.com/jheytompkins/formation/blob/master/example.html) page:

		var formation = require('formation');
		var element = document.querySelector('#form-one');
		var myFormation = new formation(element)

Can pass in options such as different animations:

		//configuring field animations.
		var myNestedFormation = new formation(element, {
				forwardExitAnimation: 'fadeOut',
				forwardEntranceAnimation: 'fadeIn',
				backwardExitAnimation: 'fadeOut',
				backwardEntranceAnimation: 'fadeIn'
			});


## Use without component package manager

 If you want to use formation without the component package manager you can by simply adding [jheytompkins_formation.js](https://github.com/jheytompkins/formation/master/jheytompkins_formation.js) to your script files and using in the following way:

	 		var wheel = new jheytompkins_formation(element, {
	 			//options
	 		});

Remember to also add necessary style files.

## API

The following options can be used with formation:

		forwardSectionExitAnimation: string - name of a CSS class/keyframe used for section navigation animation.
		forwardSectionEntranceAnimation: string - name of a CSS class/keyframe used for section navigation animation.
		backwardSectionExitAnimation: string - name of a CSS class/keyframe used for section navigation animation.
		backwardSectionEntranceAnimation: string - name of a CSS class/keyframe used for section navigation animation.

		forwardExitAnimation: string - name of a CSS class/keyframe used for field navigation animation.
		forwardEntranceAnimation: string - name of a CSS class/keyframe used for field navigation animation.
		backwardExitAnimation: string - name of a CSS class/keyframe used for field navigation animation.
		backwardEntranceAnimation: string - name of a CSS class/keyframe used for field navigation animation.

		addNavigationControls: true / false - defines whether you wish for navigation controls to be appended to the bottom of the form.
		height: string / number - defines height of the form.
		width: string / number - defines width of the form.
		animationSpeed: number - defines animation speed between fields in ms. ie. 1000 = 1 second.

The following methods are also available:

	next() : navigate to the next field.
	previous() : navigate to the previous field.
	goToField() : navigate to the field with a  certain index.

## Contributions and Suggestions

Are always welcome of course :)

## License

  MIT
