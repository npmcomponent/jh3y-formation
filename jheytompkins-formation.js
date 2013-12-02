;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};

require.register("formation/index.js", function(exports, require, module){
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
		//section animations
		forwardSectionExitAnimation: 'rotateOutUpRight',
		forwardSectionEntranceAnimation: 'rotateInUpLeft',
		backwardSectionExitAnimation: 'rotateOutUpLeft',
		backwardSectionEntranceAnimation: 'rotateInDownRight',
		//field animations
		forwardExitAnimation: 'fadeOutUpBig',
		forwardEntranceAnimation: 'fadeInUpBig',
		backwardExitAnimation: 'fadeOutDownBig',
		backwardEntranceAnimation: 'fadeInDownBig',
		addNavigationControls: true,
		height: 'auto',
		width: '100%',
		animationSpeed: 500
	};
	this.element = element;
	this.options = extend(this.defaults, options);
	this.inAnimatedState = 'false';
	if (this.options.name) {
		this.name = this.options.name;
	} else if (this.element.getAttribute('id') !== null) {
		this.name = this.element.getAttribute('id');
	} else {
		this.name = (Math.floor((Math.random()*100)+1)).toString(); 
	}
	this._create();
}
formation.prototype._create = function () {
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
		item.setAttribute('style', '-webkit-animation-duration: ' + ((formation.options.animationSpeed / 2) / 1000) + 's;' + '-moz-animation-duration: ' + ((formation.options.animationSpeed / 2) / 1000) + 's;' + '-o-animation-duration: ' + ((formation.options.animationSpeed / 2) / 1000) + 's;' + '-animation-duration: ' + ((formation.options.animationSpeed / 2) / 1000) + 's;');
	});
	this.element.querySelector('fieldset').className = this.element.querySelector('fieldset').className + ' current ' + this.options.forwardSectionEntranceAnimation;
	[].forEach.call(this.element.querySelectorAll('fieldset'), function (field, index) {
		field.setAttribute('data-formation-field-index', index + 1);	
	});
	if (this.element.querySelector('section')) {
		this.element.querySelector('section').className = this.element.querySelector('section').className + ' current ' + this.options.forwardSectionEntranceAnimation;
		[].forEach.call(this.element.querySelectorAll('section'), function (section, index) {
			section.setAttribute('data-formation-section-index', index + 1);	
		});
	}
	if (this.options.addNavigationControls) {
		this._createNav();
	}
}
formation.prototype._move = function (direction) {
	var formation = this,
		index = parseInt(formation.element.querySelector('fieldset.current').getAttribute('data-formation-field-index'), 10),
		currentField = formation.element.querySelector('fieldset.current'),
		currentSection,
		destinationIndex,
		destinationField,
		exitAnimation,
		func,
		entranceAnimation,
		animateMove = function (myentrance, myexit, section) {
			if (formation.inAnimatedState === 'false') {
				formation.inAnimatedState = 'true';
				if (section) {
					currentSection.className = currentSection.className + ' ' + myexit;
				}
				currentField.className = currentField.className + ' ' + myexit;
				var animate = setTimeout(function () {
					currentField.className = currentField.className.replace('current', '');
					if (section) {
						currentSection.className = currentSection.className.replace('current', '');
						destinationField.parentNode.className = destinationField.parentNode.className + ' ' + myentrance + ' current';
					} 
					destinationField.className = destinationField.className + ' ' + myentrance + ' current';
				}, (formation.options.animationSpeed / 2));
				setTimeout(function () {
					formation.inAnimatedState = 'false';
				}, formation.options.animationSpeed);
			}
		};
	formation.resetAnimation();
	if (formation.element.querySelector('section.current') !== null) {
		currentSection = formation.element.querySelector('section.current');
	}
	if (!direction || direction === 'forward') {
		direction = 'forward';
		destinationIndex = index + 1;
	} else if (direction === 'backward') {
		destinationIndex = index - 1;
	} else if (typeof(direction) === 'number') {
		destinationIndex = direction;
	}
	destinationField = formation.element.querySelector('[data-formation-field-index="' + destinationIndex + '"]');
	if (index !== destinationIndex && destinationIndex >= 0 && destinationField !== null && destinationField !== undefined) {
		if (typeof(direction) === 'number') {
			var isASibling = currentField.parentNode.querySelector('[data-formation-field-index="' + destinationIndex + '"]');
			if (isASibling !== undefined && isASibling !== null) {
				if (index < destinationIndex) {
					animateMove(formation.options.forwardEntranceAnimation, formation.options.forwardExitAnimation, false);
				} else {
					animateMove(formation.options.backwardEntranceAnimation, formation.options.backwardExitAnimation, false);
				}
			} else {
				if (index < destinationIndex) {
					animateMove(formation.options.forwardSectionEntranceAnimation, formation.options.forwardSectionExitAnimation, true)
				} else {
					animateMove(formation.options.backwardSectionEntranceAnimation, formation.options.backwardSectionExitAnimation, true);
				}
			}
		} else {
			if (direction === 'forward' && currentField.nextElementSibling !== null && currentField.nextElementSibling !== undefined && currentField.nextElementSibling.tagName.toLowerCase() === 'fieldset' ) { // we are just navigating to the next field so nothing crazy
					animateMove(formation.options.forwardEntranceAnimation, formation.options.forwardExitAnimation, false);
			} else if (direction === 'backward' && currentField.previousElementSibling !== null && currentField.previousElementSibling !== undefined && currentField.previousElementSibling.tagName.toLowerCase() === 'fieldset' ) {
					animateMove(formation.options.backwardEntranceAnimation, formation.options.backwardExitAnimation, false);
			} else {
				if (direction === 'forward') {
					animateMove(formation.options.forwardSectionEntranceAnimation, formation.options.forwardSectionExitAnimation, true);
				} else {
					animateMove(formation.options.backwardSectionEntranceAnimation, formation.options.backwardSectionExitAnimation, true);
				}
			}
		}
	} else if (direction === 'forward' && formation.options.submitFunction) {
		formation.options.submitFunction();
	} 
}
formation.prototype.resetAnimation = function () {
	var regex = new RegExp(this.options.forwardExitAnimation + '|' + this.options.forwardEntranceAnimation + '|' + this.options.backwardEntranceAnimation + '|' + this.options.backwardExitAnimation + '|' + this.options.forwardSectionEntranceAnimation + '|' + this.options.forwardSectionExitAnimation + '|' + this.options.backwardSectionEntranceAnimation + '|' + this.options.backwardSectionExitAnimation, 'gi');
	[].forEach.call(this.element.querySelectorAll('section, fieldset'), function (item) {
		item.className = item.className.replace(regex, '');
	});
}
formation.prototype.next = function () {
	this._move('forward');
}
formation.prototype.previous = function () {
	this._move('backward');
}
formation.prototype.goToField = function (index) {
	this._move(index);
}
formation.prototype._createNav = function () {
	var formation = this;
	var controlsHolder = document.createElement('div');
	controlsHolder.className = 'formation-nav-ctrls';
	var next = document.createElement('button');
	next.setAttribute('data-formation-next', true);
	next.innerHTML = 'Next';
	next.addEventListener('click', function () {
		formation._move('forward');
	});
	var previous = document.createElement('button');
	previous.setAttribute('data-formation-previous', true);
	previous.innerHTML = 'Previous';
	previous.addEventListener('click', function () {
		formation._move('backward');
	});
	controlsHolder.appendChild(next);
	controlsHolder.appendChild(previous);
	this.element.appendChild(controlsHolder);
}
formation.prototype.val = function () {

}

});

require.alias("formation/index.js", "formation/index.js");if (typeof exports == "object") {
  module.exports = require("formation");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("formation"); });
} else {
  this["jh3y-formation"] = require("formation");
}})();