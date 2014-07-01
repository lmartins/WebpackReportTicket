/*!
 * iDomLive
 * 0.1.0:1404242759731 [development build]
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Tip = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	module.exports = __webpack_require__(4);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	__webpack_require__(5)
		// The css code:
		(__webpack_require__(3))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".tip {\n  position: absolute;\n  padding: 5px;\n  z-index: 1000;\n  /* default offset for edge-cases: https://github.com/component/tip/pull/12 */\n  top: 0;\n  left: 0;\n}\n\n/* effects */\n\n.tip.fade {\n  transition: opacity 100ms;\n  -moz-transition: opacity 100ms;\n  -webkit-transition: opacity 100ms;\n}\n\n.tip-hide {\n  opacity: 0;\n}\n";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var bind = __webpack_require__(6);
	var Emitter = __webpack_require__(7);
	var events = __webpack_require__(8);
	var query = __webpack_require__(9);
	var domify = __webpack_require__(10);
	var classes = __webpack_require__(11);
	var css = __webpack_require__(12);
	var html = domify(__webpack_require__(20));
	var offset = __webpack_require__(13);
	
	/**
	 * Expose `Tip`.
	 */
	
	module.exports = Tip;
	
	/**
	 * Apply the average use-case of simply
	 * showing a tool-tip on `el` hover.
	 *
	 * Options:
	 *
	 *  - `delay` hide delay in milliseconds [0]
	 *  - `value` defaulting to the element's title attribute
	 *
	 * @param {Mixed} elem
	 * @param {Object|String} options or value
	 * @api public
	 */
	
	function tip(elem, options) {
	  if ('string' == typeof options) options = { value : options };
	  var els = ('string' == typeof elem) ? query.all(elem) : [elem];
	  for(var i = 0, el; el = els[i]; i++) {
	    var val = options.value || el.getAttribute('title');
	    var tip = new Tip(val, options);
	    el.setAttribute('title', '');
	    tip.cancelHideOnHover();
	    tip.attach(el);
	  }
	}
	
	/**
	 * Initialize a `Tip` with the given `content`.
	 *
	 * @param {Mixed} content
	 * @api public
	 */
	
	function Tip(content, options) {
	  options = options || {};
	  if (!(this instanceof Tip)) return tip(content, options);
	  Emitter.call(this);
	  this.classname = '';
	  this.delay = options.delay || 300;
	  this.el = html.cloneNode(true);
	  this.events = events(this.el, this);
	  this.classes = classes(this.el);
	  this.inner = query('.tip-inner', this.el);
	  this.message(content);
	  this.position('top');
	  if (Tip.effect) this.effect(Tip.effect);
	}
	
	/**
	 * Mixin emitter.
	 */
	
	Emitter(Tip.prototype);
	
	/**
	 * Set tip `content`.
	 *
	 * @param {String|jQuery|Element} content
	 * @return {Tip} self
	 * @api public
	 */
	
	Tip.prototype.message = function(content){
	  this.inner.innerHTML = content;
	  return this;
	};
	
	/**
	 * Attach to the given `el` with optional hide `delay`.
	 *
	 * @param {Element} el
	 * @param {Number} delay
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.attach = function(el){
	  var self = this;
	  this.target = el;
	  this.handleEvents = events(el, this);
	  this.handleEvents.bind('mouseover');
	  this.handleEvents.bind('mouseout');
	  return this;
	};
	
	/**
	 * On mouse over
	 *
	 * @param {Event} e
	 * @return {Tip}
	 * @api private
	 */
	
	Tip.prototype.onmouseover = function() {
	  this.show(this.target);
	  this.cancelHide();
	};
	
	/**
	 * On mouse out
	 *
	 * @param {Event} e
	 * @return {Tip}
	 * @api private
	 */
	
	Tip.prototype.onmouseout = function() {
	  this.hide(this.delay);
	};
	
	/**
	 * Cancel hide on hover, hide with the given `delay`.
	 *
	 * @param {Number} delay
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.cancelHideOnHover = function(){
	  this.events.bind('mouseover', 'cancelHide');
	  this.events.bind('mouseout', 'hide');
	  return this;
	};
	
	/**
	 * Set the effect to `type`.
	 *
	 * @param {String} type
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.effect = function(type){
	  this._effect = type;
	  this.classes.add(type);
	  return this;
	};
	
	/**
	 * Set position:
	 *
	 *  - `top`
	 *  - `top left`
	 *  - `top right`
	 *  - `bottom`
	 *  - `bottom left`
	 *  - `bottom right`
	 *  - `left`
	 *  - `right`
	 *
	 * @param {String} pos
	 * @param {Object} options
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.position = function(pos, options){
	  options = options || {};
	  this._position = pos;
	  this._auto = false != options.auto;
	  this.replaceClass(pos);
	  this.emit('reposition');
	  return this;
	};
	
	/**
	 * Show the tip attached to `el`.
	 *
	 * Emits "show" (el) event.
	 *
	 * @param {String|Element|Number} el or x
	 * @param {Number} [y]
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.show = function(el){
	  if ('string' == typeof el) el = query(el);
	
	  // show it
	  this.target = el;
	  document.body.appendChild(this.el);
	  this.classes.add('tip-' + this._position.replace(/\s+/g, '-'));
	  this.classes.remove('tip-hide');
	
	  // x,y
	  if ('number' == typeof el) {
	    var x = arguments[0];
	    var y = arguments[1];
	    this.emit('show');
	    css(this.el, {
	      top: y,
	      left: x
	    });
	    return this;
	  }
	
	  // el
	  this.reposition();
	  this.emit('show', this.target);
	
	  if (!this.winEvents) {
	    this.winEvents = events(window, this);
	    this.winEvents.bind('resize', 'reposition');
	    this.winEvents.bind('scroll', 'reposition');
	  }
	
	  return this;
	};
	
	/**
	 * Reposition the tip if necessary.
	 *
	 * @api private
	 */
	
	Tip.prototype.reposition = function(){
	  var pos = this._position;
	  var off = this.offset(pos);
	  var newpos = this._auto && this.suggested(pos, off);
	  if (newpos) off = this.offset(pos = newpos);
	  this.replaceClass(pos);
	  this.emit('reposition');
	  css(this.el, off);
	};
	
	/**
	 * Compute the "suggested" position favouring `pos`.
	 * Returns undefined if no suggestion is made.
	 *
	 * @param {String} pos
	 * @param {Object} offset
	 * @return {String}
	 * @api private
	 */
	
	Tip.prototype.suggested = function(pos, off){
	  var el = this.el;
	
	  var ew = el.clientWidth;
	  var eh = el.clientHeight;
	  var top = window.scrollY;
	  var left = window.scrollX;
	  var w = window.innerWidth;
	  var h = window.innerHeight;
	
	  // too low
	  if (off.top + eh > top + h) return 'top';
	
	  // too high
	  if (off.top < top) return 'bottom';
	
	  // too far to the right
	  if (off.left + ew > left + w) return 'left';
	
	  // too far to the left
	  if (off.left < left) return 'right';
	};
	
	/**
	 * Replace position class `name`.
	 *
	 * @param {String} name
	 * @api private
	 */
	
	Tip.prototype.replaceClass = function(name){
	  name = name.split(' ').join('-');
	  var classname = this.classname + ' tip tip-' + name;
	  if (this._effect) classname += ' ' + this._effect;
	  this.el.setAttribute('class', classname);
	};
	
	/**
	 * Compute the offset for `.target`
	 * based on the given `pos`.
	 *
	 * @param {String} pos
	 * @return {Object}
	 * @api private
	 */
	
	Tip.prototype.offset = function(pos){
	  var pad = 15;
	
	  var tipDims = dimensions(this.el);
	  if (!tipDims) throw new Error('could not determine dimensions of Tip element');
	  var ew = tipDims.width;
	  var eh = tipDims.height;
	
	  var to = offset(this.target);
	  if (!to) throw new Error('could not determine page offset of `target`');
	
	  var dims = dimensions(this.target);
	  if (!dims) throw new Error('could not determine dimensions of `target`');
	  var tw = dims.width;
	  var th = dims.height;
	
	  switch (pos) {
	    case 'top':
	      return {
	        top: to.top - eh,
	        left: to.left + tw / 2 - ew / 2
	      }
	    case 'bottom':
	      return {
	        top: to.top + th,
	        left: to.left + tw / 2 - ew / 2
	      }
	    case 'right':
	      return {
	        top: to.top + th / 2 - eh / 2,
	        left: to.left + tw
	      }
	    case 'left':
	      return {
	        top: to.top + th / 2 - eh / 2,
	        left: to.left - ew
	      }
	    case 'top left':
	      return {
	        top: to.top - eh,
	        left: to.left + tw / 2 - ew + pad
	      }
	    case 'top right':
	      return {
	        top: to.top - eh,
	        left: to.left + tw / 2 - pad
	      }
	    case 'bottom left':
	      return {
	        top: to.top + th,
	        left: to.left + tw / 2 - ew + pad
	      }
	    case 'bottom right':
	      return {
	        top: to.top + th,
	        left: to.left + tw / 2 - pad
	      }
	    default:
	      throw new Error('invalid position "' + pos + '"');
	  }
	};
	
	/**
	 * Cancel the `.hide()` timeout.
	 *
	 * @api private
	 */
	
	Tip.prototype.cancelHide = function(){
	  clearTimeout(this._hide);
	};
	
	/**
	 * Hide the tip with optional `ms` delay.
	 *
	 * Emits "hide" event.
	 *
	 * @param {Number} ms
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.hide = function(ms){
	  var self = this;
	
	  // duration
	  if (ms) {
	    this._hide = setTimeout(bind(this, this.hide), ms);
	    return this;
	  }
	
	  // hide
	  this.classes.add('tip-hide');
	  if (this._effect) {
	    setTimeout(bind(this, this.remove), 300);
	  } else {
	    self.remove();
	  }
	
	  return this;
	};
	
	/**
	 * Hide the tip without potential animation.
	 *
	 * @return {Tip}
	 * @api public
	 */
	
	Tip.prototype.remove = function(){
	  if (this.winEvents) {
	    this.winEvents.unbind();
	    this.winEvents = null;
	  }
	  this.emit('hide');
	
	  var parent = this.el.parentNode;
	  if (parent) parent.removeChild(this.el);
	  return this;
	};
	
	/**
	 * Returns an Object with `width` and `height` values which represent the
	 * dimensions of the given `node` which could be a DOM Element, Range, etc.
	 *
	 * TODO: extract this into a standalone module
	 *
	 * @private
	 */
	
	function dimensions(node) {
	  var dims;
	  var ow = node.offsetWidth;
	  var oh = node.offsetHeight;
	
	  // use `offsetWidth` and `offsetHeight` by default if available
	  if (ow != null && oh != null) {
	    dims = { width: ow, height: oh };
	  }
	
	  // fallback to `getBoundingClientRect()` if available
	  if ((!dims || (!dims.width && !dims.height)) &&
	      'function' == typeof node.getBoundingClientRect) {
	    dims = node.getBoundingClientRect();
	  }
	
	  return dims;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(cssCode) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		document.getElementsByTagName("head")[0].appendChild(styleElement);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(17);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(18);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(22);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var events = __webpack_require__(23);
	var delegate = __webpack_require__(24);
	
	/**
	 * Expose `Events`.
	 */
	
	module.exports = Events;
	
	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */
	
	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}
	
	/**
	 * Subscription helper.
	 */
	
	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};
	
	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */
	
	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);
	
	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }
	
	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }
	
	  // subscription for unbinding
	  this.sub(name, method, cb);
	
	  return cb;
	};
	
	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */
	
	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);
	
	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;
	
	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;
	
	  events.unbind(this.el, event, cb);
	};
	
	/**
	 * Unbind all events.
	 *
	 * @api private
	 */
	
	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};
	
	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */
	
	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;
	
	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};
	
	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */
	
	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Slice reference.
	 */
	
	var slice = [].slice;
	
	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */
	
	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	module.exports = Emitter;
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};
	
	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}
	
	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};
	
	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};
	
	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `parse`.
	 */
	
	module.exports = parse;
	
	/**
	 * Wrap map from jquery.
	 */
	
	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  _default: [0, '', '']
	};
	
	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];
	
	map.text =
	map.circle =
	map.ellipse =
	map.line =
	map.path =
	map.polygon =
	map.polyline =
	map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];
	
	/**
	 * Parse `html` and return the children.
	 *
	 * @param {String} html
	 * @return {Array}
	 * @api private
	 */
	
	function parse(html) {
	  if ('string' != typeof html) throw new TypeError('String expected');
	  
	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return document.createTextNode(html);
	
	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace
	
	  var tag = m[1];
	
	  // body support
	  if (tag == 'body') {
	    var el = document.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }
	
	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = document.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;
	
	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }
	
	  // several elements
	  var fragment = document.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }
	
	  return fragment;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var index = __webpack_require__(25);
	
	/**
	 * Whitespace regexp.
	 */
	
	var re = /\s+/;
	
	/**
	 * toString reference.
	 */
	
	var toString = Object.prototype.toString;
	
	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */
	
	module.exports = function(el){
	  return new ClassList(el);
	};
	
	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */
	
	function ClassList(el) {
	  if (!el) throw new Error('A DOM element reference is required');
	  this.el = el;
	  this.list = el.classList;
	}
	
	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */
	
	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }
	
	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};
	
	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */
	
	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }
	
	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }
	
	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};
	
	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */
	
	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};
	
	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */
	
	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }
	
	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */
	
	ClassList.prototype.array = function(){
	  var str = this.el.className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};
	
	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */
	
	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div class=\"tip tip-hide\">\n  <div class=\"tip-arrow\"></div>\n  <div class=\"tip-inner\"></div>\n</div>";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var debug = __webpack_require__(26)('css');
	var set = __webpack_require__(27);
	var get = __webpack_require__(28);
	
	/**
	 * Expose `css`
	 */
	
	module.exports = css;
	
	/**
	 * Get and set css values
	 *
	 * @param {Element} el
	 * @param {String|Object} prop
	 * @param {Mixed} val
	 * @return {Element} el
	 * @api public
	 */
	
	function css(el, prop, val) {
	  if (!el) return;
	
	  if (undefined !== val) {
	    var obj = {};
	    obj[prop] = val;
	    debug('setting styles %j', obj);
	    return setStyles(el, obj);
	  }
	
	  if ('object' == typeof prop) {
	    debug('setting styles %j', prop);
	    return setStyles(el, prop);
	  }
	
	  debug('getting %s', prop);
	  return get(el, prop);
	}
	
	/**
	 * Set the styles on an element
	 *
	 * @param {Element} el
	 * @param {Object} props
	 * @return {Element} el
	 */
	
	function setStyles(el, props) {
	  for (var prop in props) {
	    set(el, prop, props[prop]);
	  }
	
	  return el;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var support = __webpack_require__(29)
	var contains = __webpack_require__(30)
	
	/**
	 * Get offset of an element within the viewport.
	 *
	 * @api public
	 */
	
	module.exports = function offset(el) {
	  var doc = el && el.ownerDocument
	  if (!doc) return
	
	  // Make sure it's not a disconnected DOM node
	  if (!contains(el)) return box
	
	  var body = doc.body
	  if (body === el) {
	    return bodyOffset(el)
	  }
	
	  var box = { top: 0, left: 0 }
	  if ( typeof el.getBoundingClientRect !== "undefined" ) {
	    // If we don't have gBCR, just use 0,0 rather than error
	    // BlackBerry 5, iOS 3 (original iPhone)
	    box = el.getBoundingClientRect()
	  }
	
	  var docEl = doc.documentElement
	  var clientTop  = docEl.clientTop  || body.clientTop  || 0
	  var clientLeft = docEl.clientLeft || body.clientLeft || 0
	  var scrollTop  = window.pageYOffset || docEl.scrollTop
	  var scrollLeft = window.pageXOffset || docEl.scrollLeft
	
	  return {
	    top: box.top  + scrollTop  - clientTop,
	    left: box.left + scrollLeft - clientLeft
	  }
	}
	
	function bodyOffset(body) {
	  var top = body.offsetTop
	  var left = body.offsetLeft
	
	  if (support.doesNotIncludeMarginInBodyOffset) {
	    top  += parseFloat(body.style.marginTop || 0)
	    left += parseFloat(body.style.marginLeft || 0)
	  }
	
	  return {
	    top: top,
	    left: left
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(33);

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(34);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var debug = __webpack_require__(26)('css:style');
	var camelcase = __webpack_require__(41);
	var support = __webpack_require__(39);
	var property = __webpack_require__(37);
	var hooks = __webpack_require__(38);
	
	/**
	 * Expose `style`
	 */
	
	module.exports = style;
	
	/**
	 * Possibly-unitless properties
	 *
	 * Don't automatically add 'px' to these properties
	 */
	
	var cssNumber = {
	  "columnCount": true,
	  "fillOpacity": true,
	  "fontWeight": true,
	  "lineHeight": true,
	  "opacity": true,
	  "order": true,
	  "orphans": true,
	  "widows": true,
	  "zIndex": true,
	  "zoom": true
	};
	
	/**
	 * Set a css value
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {Mixed} val
	 * @param {Mixed} extra
	 */
	
	function style(el, prop, val, extra) {
	  // Don't set styles on text and comment nodes
	  if (!el || el.nodeType === 3 || el.nodeType === 8 || !el.style ) return;
	
	  var orig = camelcase(prop);
	  var style = el.style;
	  var type = typeof val;
	
	  if (!val) return get(el, prop, orig, extra);
	
	  prop = property(prop, style);
	
	  var hook = hooks[prop] || hooks[orig];
	
	  // If a number was passed in, add 'px' to the (except for certain CSS properties)
	  if ('number' == type && !cssNumber[orig]) {
	    debug('adding "px" to end of number');
	    val += 'px';
	  }
	
	  // Fixes jQuery #8908, it can be done more correctly by specifying setters in cssHooks,
	  // but it would mean to define eight (for every problematic property) identical functions
	  if (!support.clearCloneStyle && '' === val && 0 === prop.indexOf('background')) {
	    debug('set property (%s) value to "inherit"', prop);
	    style[prop] = 'inherit';
	  }
	
	  // If a hook was provided, use that value, otherwise just set the specified value
	  if (!hook || !hook.set || undefined !== (val = hook.set(el, val, extra))) {
	    // Support: Chrome, Safari
	    // Setting style to blank string required to delete "style: x !important;"
	    debug('set hook defined. setting property (%s) to %s', prop, val);
	    style[prop] = '';
	    style[prop] = val;
	  }
	
	}
	
	/**
	 * Get the style
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {String} orig
	 * @param {Mixed} extra
	 * @return {String}
	 */
	
	function get(el, prop, orig, extra) {
	  var style = el.style;
	  var hook = hooks[prop] || hooks[orig];
	  var ret;
	
	  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {
	    debug('get hook defined, returning: %s', ret);
	    return ret;
	  }
	
	  ret = style[prop];
	  debug('getting %s', ret);
	  return ret;
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var debug = __webpack_require__(26)('css:css');
	var camelcase = __webpack_require__(41);
	var computed = __webpack_require__(36);
	var property = __webpack_require__(37);
	
	/**
	 * Expose `css`
	 */
	
	module.exports = css;
	
	/**
	 * CSS Normal Transforms
	 */
	
	var cssNormalTransform = {
	  letterSpacing: 0,
	  fontWeight: 400
	};
	
	/**
	 * Get a CSS value
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {Mixed} extra
	 * @param {Array} styles
	 * @return {String}
	 */
	
	function css(el, prop, extra, styles) {
	  var hooks = __webpack_require__(38);
	  var orig = camelcase(prop);
	  var style = el.style;
	  var val;
	
	  prop = property(prop, style);
	  var hook = hooks[prop] || hooks[orig];
	
	  // If a hook was provided get the computed value from there
	  if (hook && hook.get) {
	    debug('get hook provided. use that');
	    val = hook.get(el, true, extra);
	  }
	
	  // Otherwise, if a way to get the computed value exists, use that
	  if (undefined == val) {
	    debug('fetch the computed value of %s', prop);
	    val = computed(el, prop);
	  }
	
	  if ('normal' == val && cssNormalTransform[prop]) {
	    val = cssNormalTransform[prop];
	    debug('normal => %s', val);
	  }
	
	  // Return, converting to number if forced or a qualifier was provided and val looks numeric
	  if ('' == extra || extra) {
	    debug('converting value: %s into a number', val);
	    var num = parseFloat(val);
	    return true === extra || isNumeric(num) ? num || 0 : val;
	  }
	
	  return val;
	}
	
	/**
	 * Is Numeric
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 */
	
	function isNumeric(obj) {
	  return !isNan(parseFloat(obj)) && isFinite(obj);
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(35);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(40);

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';
	
	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};
	
	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var closest = __webpack_require__(44)
	  , event = __webpack_require__(23);
	
	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */
	
	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};
	
	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */
	
	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(42);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors and the Firebug
	 * extension (*not* the built-in Firefox web inpector) are
	 * known to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table)));
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? '%c ' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, ''].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // This hackery is required for IE8,
	  // where the `console.log` function doesn't have 'apply'
	  return 'object' == typeof console
	    && 'function' == typeof console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      localStorage.removeItem('debug');
	    } else {
	      localStorage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = localStorage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var domready = __webpack_require__(45)()
	
	module.exports = (function() {
	
		var support,
			all,
			a,
			select,
			opt,
			input,
			fragment,
			eventName,
			i,
			isSupported,
			clickFn,
			div = document.createElement("div");
	
		// Setup
		div.setAttribute( "className", "t" );
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
		// Support tests won't run in some limited or non-browser environments
		all = div.getElementsByTagName("*");
		a = div.getElementsByTagName("a")[ 0 ];
		if ( !all || !a || !all.length ) {
			return {};
		}
	
		// First batch of tests
		select = document.createElement("select");
		opt = select.appendChild( document.createElement("option") );
		input = div.getElementsByTagName("input")[ 0 ];
	
		a.style.cssText = "top:1px;float:left;opacity:.5";
		support = {
			// IE strips leading whitespace when .innerHTML is used
			leadingWhitespace: ( div.firstChild.nodeType === 3 ),
	
			// Make sure that tbody elements aren't automatically inserted
			// IE will insert them into empty tables
			tbody: !div.getElementsByTagName("tbody").length,
	
			// Make sure that link elements get serialized correctly by innerHTML
			// This requires a wrapper element in IE
			htmlSerialize: !!div.getElementsByTagName("link").length,
	
			// Get the style information from getAttribute
			// (IE uses .cssText instead)
			style: /top/.test( a.getAttribute("style") ),
	
			// Make sure that URLs aren't manipulated
			// (IE normalizes it by default)
			hrefNormalized: ( a.getAttribute("href") === "/a" ),
	
			// Make sure that element opacity exists
			// (IE uses filter instead)
			// Use a regex to work around a WebKit issue. See #5145
			opacity: /^0.5/.test( a.style.opacity ),
	
			// Verify style float existence
			// (IE uses styleFloat instead of cssFloat)
			cssFloat: !!a.style.cssFloat,
	
			// Make sure that if no value is specified for a checkbox
			// that it defaults to "on".
			// (WebKit defaults to "" instead)
			checkOn: ( input.value === "on" ),
	
			// Make sure that a selected-by-default option has a working selected property.
			// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
			optSelected: opt.selected,
	
			// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
			getSetAttribute: div.className !== "t",
	
			// Tests for enctype support on a form (#6743)
			enctype: !!document.createElement("form").enctype,
	
			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",
	
			// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
			boxModel: ( document.compatMode === "CSS1Compat" ),
	
			// Will be defined later
			submitBubbles: true,
			changeBubbles: true,
			focusinBubbles: false,
			deleteExpando: true,
			noCloneEvent: true,
			inlineBlockNeedsLayout: false,
			shrinkWrapBlocks: false,
			reliableMarginRight: true,
			boxSizingReliable: true,
			pixelPosition: false
		};
	
		// Make sure checked status is properly cloned
		input.checked = true;
		support.noCloneChecked = input.cloneNode( true ).checked;
	
		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Test to see if it's possible to delete an expando from an element
		// Fails in Internet Explorer
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	
		if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
			div.attachEvent( "onclick", clickFn = function() {
				// Cloning a node shouldn't copy over any
				// bound event handlers (IE does this)
				support.noCloneEvent = false;
			});
			div.cloneNode( true ).fireEvent("onclick");
			div.detachEvent( "onclick", clickFn );
		}
	
		// Check if a radio maintains its value
		// after being appended to the DOM
		input = document.createElement("input");
		input.value = "t";
		input.setAttribute( "type", "radio" );
		support.radioValue = input.value === "t";
	
		input.setAttribute( "checked", "checked" );
	
		// #11217 - WebKit loses check when the name is after the checked attribute
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
		fragment = document.createDocumentFragment();
		fragment.appendChild( div.lastChild );
	
		// WebKit doesn't clone checked state correctly in fragments
		support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		support.appendChecked = input.checked;
	
		fragment.removeChild( input );
		fragment.appendChild( div );
	
		// Technique from Juriy Zaytsev
		// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !div.addEventListener ) {
			for ( i in {
				submit: true,
				change: true,
				focusin: true
			}) {
				eventName = "on" + i;
				isSupported = ( eventName in div );
				if ( !isSupported ) {
					div.setAttribute( eventName, "return;" );
					isSupported = ( typeof div[ eventName ] === "function" );
				}
				support[ i + "Bubbles" ] = isSupported;
			}
		}
	
		// Run tests that need a body at doc ready
		domready(function() {
			var container, div, tds, marginDiv,
				divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
				body = document.getElementsByTagName("body")[0];
	
			if ( !body ) {
				// Return for frameset docs that don't have a body
				return;
			}
	
			container = document.createElement("div");
			container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
			body.insertBefore( container, body.firstChild );
	
			// Construct the test element
			div = document.createElement("div");
			container.appendChild( div );
	
	    //Check if table cells still have offsetWidth/Height when they are set
	    //to display:none and there are still other visible table cells in a
	    //table row; if so, offsetWidth/Height are not reliable for use when
	    //determining if an element has been hidden directly using
	    //display:none (it is still safe to use offsets if a parent element is
	    //hidden; don safety goggles and see bug #4512 for more information).
	    //(only IE 8 fails this test)
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName("td");
			tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
			isSupported = ( tds[ 0 ].offsetHeight === 0 );
	
			tds[ 0 ].style.display = "";
			tds[ 1 ].style.display = "none";
	
			// Check if empty table cells still have offsetWidth/Height
			// (IE <= 8 fail this test)
			support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	
			// Check box-sizing and margin behavior
			div.innerHTML = "";
			div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
			support.boxSizing = ( div.offsetWidth === 4 );
			support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );
	
			// NOTE: To any future maintainer, we've window.getComputedStyle
			// because jsdom on node.js will break without it.
			if ( window.getComputedStyle ) {
				support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
				support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
	
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. For more
				// info see bug #3333
				// Fails in WebKit before Feb 2011 nightlies
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				marginDiv = document.createElement("div");
				marginDiv.style.cssText = div.style.cssText = divReset;
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				div.appendChild( marginDiv );
				support.reliableMarginRight =
					!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
			}
	
			if ( typeof div.style.zoom !== "undefined" ) {
				// Check if natively block-level elements act like inline-block
				// elements when setting their display to 'inline' and giving
				// them layout
				// (IE < 8 does this)
				div.innerHTML = "";
				div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
				support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );
	
				// Check if elements with layout shrink-wrap their children
				// (IE 6 does this)
				div.style.display = "block";
				div.style.overflow = "visible";
				div.innerHTML = "<div></div>";
				div.firstChild.style.width = "5px";
				support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
	
				container.style.zoom = 1;
			}
	
			// Null elements to avoid leaks in IE
			body.removeChild( container );
			container = div = tds = marginDiv = null;
		});
	
		// Null elements to avoid leaks in IE
		fragment.removeChild( div );
		all = a = select = opt = input = fragment = div = null;
	
		return support;
	})();


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var debug = __webpack_require__(26)('css:computed');
	var withinDocument = __webpack_require__(30);
	var styles = __webpack_require__(43);
	
	/**
	 * Expose `computed`
	 */
	
	module.exports = computed;
	
	/**
	 * Get the computed style
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {Array} precomputed (optional)
	 * @return {Array}
	 * @api private
	 */
	
	function computed(el, prop, precomputed) {
	  var computed = precomputed || styles(el);
	  var ret;
	  
	  if (!computed) return;
	
	  if (computed.getPropertyValue) {
	    ret = computed.getPropertyValue(prop) || computed[prop];
	  } else {
	    ret = computed[prop];
	  }
	
	  if ('' === ret && !withinDocument(el)) {
	    debug('element not within document, try finding from style attribute');
	    var style = __webpack_require__(27);
	    ret = style(el, prop);
	  }
	
	  debug('computed value of %s: %s', prop, ret);
	
	  // Support: IE
	  // IE returns zIndex value as an integer.
	  return undefined === ret ? ret : ret + '';
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies
	 */
	
	var debug = __webpack_require__(26)('css:prop');
	var camelcase = __webpack_require__(41);
	var vendor = __webpack_require__(46);
	
	/**
	 * Export `prop`
	 */
	
	module.exports = prop;
	
	/**
	 * Normalize Properties
	 */
	
	var cssProps = {
	  'float': 'cssFloat' in document.documentElement.style ? 'cssFloat' : 'styleFloat'
	};
	
	/**
	 * Get the vendor prefixed property
	 *
	 * @param {String} prop
	 * @param {String} style
	 * @return {String} prop
	 * @api private
	 */
	
	function prop(prop, style) {
	  prop = cssProps[prop] || (cssProps[prop] = vendor(prop, style));
	  debug('transform property: %s => %s', prop, style);
	  return prop;
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var each = __webpack_require__(48);
	var css = __webpack_require__(28);
	var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
	var rnumnonpx = new RegExp( '^(' + pnum + ')(?!px)[a-z%]+$', 'i');
	var rnumsplit = new RegExp( '^(' + pnum + ')(.*)$', 'i');
	var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
	var styles = __webpack_require__(43);
	var support = __webpack_require__(39);
	var swap = __webpack_require__(47);
	var computed = __webpack_require__(36);
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	/**
	 * Height & Width
	 */
	
	each(['width', 'height'], function(name) {
	  exports[name] = {};
	
	  exports[name].get = function(el, compute, extra) {
	    if (!compute) return;
	    // certain elements can have dimension info if we invisibly show them
	    // however, it must have a current display style that would benefit from this
	    return 0 == el.offsetWidth && rdisplayswap.test(css(el, 'display'))
	      ? swap(el, cssShow, function() { return getWidthOrHeight(el, name, extra); })
	      : getWidthOrHeight(el, name, extra);
	  }
	
	  exports[name].set = function(el, val, extra) {
	    var styles = extra && styles(el);
	    return setPositiveNumber(el, val, extra
	      ? augmentWidthOrHeight(el, name, extra, 'border-box' == css(el, 'boxSizing', false, styles), styles)
	      : 0
	    );
	  };
	
	});
	
	/**
	 * Opacity
	 */
	
	exports.opacity = {};
	exports.opacity.get = function(el, compute) {
	  if (!compute) return;
	  var ret = computed(el, 'opacity');
	  return '' == ret ? '1' : ret;
	}
	
	/**
	 * Utility: Set Positive Number
	 *
	 * @param {Element} el
	 * @param {Mixed} val
	 * @param {Number} subtract
	 * @return {Number}
	 */
	
	function setPositiveNumber(el, val, subtract) {
	  var matches = rnumsplit.exec(val);
	  return matches ?
	    // Guard against undefined 'subtract', e.g., when used as in cssHooks
	    Math.max(0, matches[1]) + (matches[2] || 'px') :
	    val;
	}
	
	/**
	 * Utility: Get the width or height
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {Mixed} extra
	 * @return {String}
	 */
	
	function getWidthOrHeight(el, prop, extra) {
	  // Start with offset property, which is equivalent to the border-box value
	  var valueIsBorderBox = true;
	  var val = prop === 'width' ? el.offsetWidth : el.offsetHeight;
	  var styles = computed(el);
	  var isBorderBox = support.boxSizing && css(el, 'boxSizing') === 'border-box';
	
	  // some non-html elements return undefined for offsetWidth, so check for null/undefined
	  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	  if (val <= 0 || val == null) {
	    // Fall back to computed then uncomputed css if necessary
	    val = computed(el, prop, styles);
	
	    if (val < 0 || val == null) {
	      val = el.style[prop];
	    }
	
	    // Computed unit is not pixels. Stop here and return.
	    if (rnumnonpx.test(val)) {
	      return val;
	    }
	
	    // we need the check for style in case a browser which returns unreliable values
	    // for getComputedStyle silently falls back to the reliable el.style
	    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === el.style[prop]);
	
	    // Normalize ', auto, and prepare for extra
	    val = parseFloat(val) || 0;
	  }
	
	  // use the active box-sizing model to add/subtract irrelevant styles
	  extra = extra || (isBorderBox ? 'border' : 'content');
	  val += augmentWidthOrHeight(el, prop, extra, valueIsBorderBox, styles);
	  return val + 'px';
	}
	
	/**
	 * Utility: Augment the width or the height
	 *
	 * @param {Element} el
	 * @param {String} prop
	 * @param {Mixed} extra
	 * @param {Boolean} isBorderBox
	 * @param {Array} styles
	 */
	
	function augmentWidthOrHeight(el, prop, extra, isBorderBox, styles) {
	  // If we already have the right measurement, avoid augmentation,
	  // Otherwise initialize for horizontal or vertical properties
	  var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : 'width' == prop ? 1 : 0;
	  var val = 0;
	
	  for (; i < 4; i += 2) {
	    // both box models exclude margin, so add it if we want it
	    if (extra === 'margin') {
	      val += css(el, extra + cssExpand[i], true, styles);
	    }
	
	    if (isBorderBox) {
	      // border-box includes padding, so remove it if we want content
	      if (extra === 'content') {
	        val -= css(el, 'padding' + cssExpand[i], true, styles);
	      }
	
	      // at this point, extra isn't border nor margin, so remove border
	      if (extra !== 'margin') {
	        val -= css(el, 'border' + cssExpand[i] + 'Width', true, styles);
	      }
	    } else {
	      // at this point, extra isn't content, so add padding
	      val += css(el, 'padding' + cssExpand[i], true, styles);
	
	      // at this point, extra isn't content nor padding, so add border
	      if (extra !== 'padding') {
	        val += css(el, 'border' + cssExpand[i] + 'Width', true, styles);
	      }
	    }
	  }
	
	  return val;
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Support values
	 */
	
	var reliableMarginRight;
	var boxSizingReliableVal;
	var pixelPositionVal;
	var clearCloneStyle;
	
	/**
	 * Container setup
	 */
	
	var docElem = document.documentElement;
	var container = document.createElement('div');
	var div = document.createElement('div');
	
	/**
	 * Clear clone style
	 */
	
	div.style.backgroundClip = 'content-box';
	div.cloneNode(true).style.backgroundClip = '';
	exports.clearCloneStyle = div.style.backgroundClip === 'content-box';
	
	container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';
	container.appendChild(div);
	
	/**
	 * Pixel position
	 *
	 * Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	 * getComputedStyle returns percent when specified for top/left/bottom/right
	 * rather than make the css module depend on the offset module, we just check for it here
	 */
	
	exports.pixelPosition = function() {
	  if (undefined == pixelPositionVal) computePixelPositionAndBoxSizingReliable();
	  return pixelPositionVal;
	}
	
	/**
	 * Reliable box sizing
	 */
	
	exports.boxSizingReliable = function() {
	  if (undefined == boxSizingReliableVal) computePixelPositionAndBoxSizingReliable();
	  return boxSizingReliableVal;
	}
	
	/**
	 * Reliable margin right
	 *
	 * Support: Android 2.3
	 * Check if div with explicit width and no margin-right incorrectly
	 * gets computed margin-right based on width of container. (#3333)
	 * WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	 * This support function is only executed once so no memoizing is needed.
	 *
	 * @return {Boolean}
	 */
	
	exports.reliableMarginRight = function() {
	  var ret;
	  var marginDiv = div.appendChild(document.createElement("div" ));
	
	  marginDiv.style.cssText = div.style.cssText = divReset;
	  marginDiv.style.marginRight = marginDiv.style.width = "0";
	  div.style.width = "1px";
	  docElem.appendChild(container);
	
	  ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);
	
	  docElem.removeChild(container);
	
	  // Clean up the div for other support tests.
	  div.innerHTML = "";
	
	  return ret;
	}
	
	/**
	 * Executing both pixelPosition & boxSizingReliable tests require only one layout
	 * so they're executed at the same time to save the second computation.
	 */
	
	function computePixelPositionAndBoxSizingReliable() {
	  // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
	  div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
	    "box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;" +
	    "position:absolute;top:1%";
	  docElem.appendChild(container);
	
	  var divStyle = window.getComputedStyle(div, null);
	  pixelPositionVal = divStyle.top !== "1%";
	  boxSizingReliableVal = divStyle.width === "4px";
	
	  docElem.removeChild(container);
	}
	
	


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var withinElement = __webpack_require__(49);
	
	/**
	 * Check if the DOM element `child` is within the page global `document`.
	 *
	 * @param {DOMElement} child - the element to check if it with within `document`
	 * @return {Boolean} True if `child` is within the `document`. False otherwise.
	 * @public
	 */
	
	module.exports = function within (child) {
	  return withinElement(child, document);
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(50);

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ms\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = exports.log || enabled.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace('*', '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Expose `styles`
	 */
	
	module.exports = styles;
	
	/**
	 * Get all the styles
	 *
	 * @param {Element} el
	 * @return {Array}
	 */
	
	function styles(el) {
	  if (window.getComputedStyle) {
	    return el.ownerDocument.defaultView.getComputedStyle(el, null);
	  } else {
	    return el.currentStyle;
	  }
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(51);

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(52);

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */
	
	var prefixes = ['Webkit', 'O', 'Moz', 'ms'];
	
	/**
	 * Expose `vendor`
	 */
	
	module.exports = vendor;
	
	/**
	 * Get the vendor prefix for a given property
	 *
	 * @param {String} prop
	 * @param {Object} style
	 * @return {String}
	 */
	
	function vendor(prop, style) {
	  // shortcut for names that are not vendor prefixed
	  if (style[prop]) return prop;
	
	  // check for vendor prefixed names
	  var capName = prop[0].toUpperCase() + prop.slice(1);
	  var original = prop;
	  var i = prefixes.length;
	
	  while (i--) {
	    prop = prefixes[i] + capName;
	    if (prop in style) return prop;
	  }
	
	  return original;
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Export `swap`
	 */
	
	module.exports = swap;
	
	/**
	 * Initialize `swap`
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @param {Function} fn
	 * @param {Array} args
	 * @return {Mixed}
	 */
	
	function swap(el, options, fn, args) {
	  // Remember the old values, and insert the new ones
	  for (var key in options) {
	    old[key] = el.style[key];
	    el.style[key] = options[key];
	  }
	
	  ret = fn.apply(el, args || []);
	
	  // Revert the old values
	  for (key in options) {
	    el.style[key] = old[key];
	  }
	
	  return ret;
	}


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(53);

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(54);

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	
	var toSpace = __webpack_require__(55);
	
	
	/**
	 * Expose `toCamelCase`.
	 */
	
	module.exports = toCamelCase;
	
	
	/**
	 * Convert a `string` to camel case.
	 *
	 * @param {String} string
	 * @return {String}
	 */
	
	
	function toCamelCase (string) {
	  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
	    return letter.toUpperCase();
	  });
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var matches = __webpack_require__(56)
	
	module.exports = function (element, selector, checkYoSelf, root) {
	  element = checkYoSelf ? {parentNode: element} : element
	
	  root = root || document
	
	  // Make sure `element !== document` and `element != null`
	  // otherwise we get an illegal invocation
	  while ((element = element.parentNode) && element !== document) {
	    if (matches(element, selector))
	      return element
	    // After `matches` on the edge case that
	    // the selector matches the root
	    // (when the root is not the document)
	    if (element === root)
	      return  
	  }
	}

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Copyright (c) 2012 Matias Meno <m@tias.me>
	 * 
	 * Original code (c) by Dustin Diaz 2012 - License MIT
	 */
	
	
	/**
	 * Expose `domready`.
	 */
	
	module.exports = domready;
	
	
	/**
	 *
	 * Cross browser implementation of the domready event
	 *
	 * @param {Function} ready - the callback to be invoked as soon as the dom is fully loaded.
	 * @api public
	 */
	
	function domready(ready) {
	 var fns = [], fn, f = false
	    , doc = document
	    , testEl = doc.documentElement
	    , hack = testEl.doScroll
	    , domContentLoaded = 'DOMContentLoaded'
	    , addEventListener = 'addEventListener'
	    , onreadystatechange = 'onreadystatechange'
	    , readyState = 'readyState'
	    , loaded = /^loade|c/.test(doc[readyState])
	
	  function flush(f) {
	    loaded = 1
	    while (f = fns.shift()) f()
	  }
	
	  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
	    doc.removeEventListener(domContentLoaded, fn, f)
	    flush()
	  }, f)
	
	
	  hack && doc.attachEvent(onreadystatechange, fn = function () {
	    if (/^c/.test(doc[readyState])) {
	      doc.detachEvent(onreadystatechange, fn)
	      flush()
	    }
	  })
	
	  return (ready = hack ?
	    function (fn) {
	      self != top ?
	        loaded ? fn() : fns.push(fn) :
	        function () {
	          try {
	            testEl.doScroll('left')
	          } catch (e) {
	            return setTimeout(function() { ready(fn) }, 50)
	          }
	          fn()
	        }()
	    } :
	    function (fn) {
	      loaded ? fn() : fns.push(fn)
	    })
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var type = __webpack_require__(57);
	var toFunction = __webpack_require__(58);
	
	/**
	 * HOP reference.
	 */
	
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * Iterate the given `obj` and invoke `fn(val, i)`
	 * in optional context `ctx`.
	 *
	 * @param {String|Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} [ctx]
	 * @api public
	 */
	
	module.exports = function(obj, fn, ctx){
	  fn = toFunction(fn);
	  ctx = ctx || this;
	  switch (type(obj)) {
	    case 'array':
	      return array(obj, fn, ctx);
	    case 'object':
	      if ('number' == typeof obj.length) return array(obj, fn, ctx);
	      return object(obj, fn, ctx);
	    case 'string':
	      return string(obj, fn, ctx);
	  }
	};
	
	/**
	 * Iterate string chars.
	 *
	 * @param {String} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */
	
	function string(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj.charAt(i), i);
	  }
	}
	
	/**
	 * Iterate object keys.
	 *
	 * @param {Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */
	
	function object(obj, fn, ctx) {
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      fn.call(ctx, key, obj[key]);
	    }
	  }
	}
	
	/**
	 * Iterate array-ish.
	 *
	 * @param {Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */
	
	function array(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj[i], i);
	  }
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Check if the DOM element `child` is within the given `parent` DOM element.
	 *
	 * @param {DOMElement|Range} child - the DOM element or Range to check if it's within `parent`
	 * @param {DOMElement} parent  - the parent node that `child` could be inside of
	 * @return {Boolean} True if `child` is within `parent`. False otherwise.
	 * @public
	 */
	
	module.exports = function within (child, parent) {
	  // don't throw if `child` is null
	  if (!child) return false;
	
	  // Range support
	  if (child.commonAncestorContainer) child = child.commonAncestorContainer;
	  else if (child.endContainer) child = child.endContainer;
	
	  // traverse up the `parentNode` properties until `parent` is found
	  var node = child;
	  while (node = node.parentNode) {
	    if (node == parent) return true;
	  }
	
	  return false;
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(59);

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(60);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(61);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(62);

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	
	var clean = __webpack_require__(63);
	
	
	/**
	 * Expose `toSpaceCase`.
	 */
	
	module.exports = toSpaceCase;
	
	
	/**
	 * Convert a `string` to space case.
	 *
	 * @param {String} string
	 * @return {String}
	 */
	
	
	function toSpaceCase (string) {
	  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
	    return match ? ' ' + match : '';
	  });
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var query = __webpack_require__(9);
	
	/**
	 * Element prototype.
	 */
	
	var proto = Element.prototype;
	
	/**
	 * Vendor function.
	 */
	
	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;
	
	/**
	 * Expose `match()`.
	 */
	
	module.exports = match;
	
	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */
	
	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * toString ref.
	 */
	
	var toString = Object.prototype.toString;
	
	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */
	
	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }
	
	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';
	
	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val)
	
	  return typeof val;
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module Dependencies
	 */
	
	var expr;
	try {
	  expr = __webpack_require__(64);
	} catch(e) {
	  expr = __webpack_require__(64);
	}
	
	/**
	 * Expose `toFunction()`.
	 */
	
	module.exports = toFunction;
	
	/**
	 * Convert `obj` to a `Function`.
	 *
	 * @param {Mixed} obj
	 * @return {Function}
	 * @api private
	 */
	
	function toFunction(obj) {
	  switch ({}.toString.call(obj)) {
	    case '[object Object]':
	      return objectToFunction(obj);
	    case '[object Function]':
	      return obj;
	    case '[object String]':
	      return stringToFunction(obj);
	    case '[object RegExp]':
	      return regexpToFunction(obj);
	    default:
	      return defaultToFunction(obj);
	  }
	}
	
	/**
	 * Default to strict equality.
	 *
	 * @param {Mixed} val
	 * @return {Function}
	 * @api private
	 */
	
	function defaultToFunction(val) {
	  return function(obj){
	    return val === obj;
	  };
	}
	
	/**
	 * Convert `re` to a function.
	 *
	 * @param {RegExp} re
	 * @return {Function}
	 * @api private
	 */
	
	function regexpToFunction(re) {
	  return function(obj){
	    return re.test(obj);
	  };
	}
	
	/**
	 * Convert property `str` to a function.
	 *
	 * @param {String} str
	 * @return {Function}
	 * @api private
	 */
	
	function stringToFunction(str) {
	  // immediate such as "> 20"
	  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);
	
	  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
	  return new Function('_', 'return ' + get(str));
	}
	
	/**
	 * Convert `object` to a function.
	 *
	 * @param {Object} object
	 * @return {Function}
	 * @api private
	 */
	
	function objectToFunction(obj) {
	  var match = {};
	  for (var key in obj) {
	    match[key] = typeof obj[key] === 'string'
	      ? defaultToFunction(obj[key])
	      : toFunction(obj[key]);
	  }
	  return function(val){
	    if (typeof val !== 'object') return false;
	    for (var key in match) {
	      if (!(key in val)) return false;
	      if (!match[key](val[key])) return false;
	    }
	    return true;
	  };
	}
	
	/**
	 * Built the getter function. Supports getter style functions
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function get(str) {
	  var props = expr(str);
	  if (!props.length) return '_.' + str;
	
	  var val, i, prop;
	  for (i = 0; i < props.length; i++) {
	    prop = props[i];
	    val = '_.' + prop;
	    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";
	
	    // mimic negative lookbehind to avoid problems with nested properties
	    str = stripNested(prop, str, val);
	  }
	
	  return str;
	}
	
	/**
	 * Mimic negative lookbehind to avoid problems with nested properties.
	 *
	 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
	 *
	 * @param {String} prop
	 * @param {String} str
	 * @param {String} val
	 * @return {String}
	 * @api private
	 */
	
	function stripNested (prop, str, val) {
	  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
	    return $1 ? $0 : val;
	  });
	}


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(65);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(66);

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `toNoCase`.
	 */
	
	module.exports = toNoCase;
	
	
	/**
	 * Test whether a string is camel-case.
	 */
	
	var hasSpace = /\s/;
	var hasCamel = /[a-z][A-Z]/;
	var hasSeparator = /[\W_]/;
	
	
	/**
	 * Remove any starting case from a `string`, like camel or snake, but keep
	 * spaces and punctuation that may be important otherwise.
	 *
	 * @param {String} string
	 * @return {String}
	 */
	
	function toNoCase (string) {
	  if (hasSpace.test(string)) return string.toLowerCase();
	
	  if (hasSeparator.test(string)) string = unseparate(string);
	  if (hasCamel.test(string)) string = uncamelize(string);
	  return string.toLowerCase();
	}
	
	
	/**
	 * Separator splitter.
	 */
	
	var separatorSplitter = /[\W_]+(.|$)/g;
	
	
	/**
	 * Un-separate a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */
	
	function unseparate (string) {
	  return string.replace(separatorSplitter, function (m, next) {
	    return next ? ' ' + next : '';
	  });
	}
	
	
	/**
	 * Camelcase splitter.
	 */
	
	var camelSplitter = /(.)([A-Z]+)/g;
	
	
	/**
	 * Un-camelcase a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */
	
	function uncamelize (string) {
	  return string.replace(camelSplitter, function (m, previous, uppers) {
	    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
	  });
	}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Global Names
	 */
	
	var globals = /\b(this|Array|Date|Object|Math|JSON)\b/g;
	
	/**
	 * Return immediate identifiers parsed from `str`.
	 *
	 * @param {String} str
	 * @param {String|Function} map function or prefix
	 * @return {Array}
	 * @api public
	 */
	
	module.exports = function(str, fn){
	  var p = unique(props(str));
	  if (fn && 'string' == typeof fn) fn = prefixed(fn);
	  if (fn) return map(str, p, fn);
	  return p;
	};
	
	/**
	 * Return immediate identifiers in `str`.
	 *
	 * @param {String} str
	 * @return {Array}
	 * @api private
	 */
	
	function props(str) {
	  return str
	    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
	    .replace(globals, '')
	    .match(/[$a-zA-Z_]\w*/g)
	    || [];
	}
	
	/**
	 * Return `str` with `props` mapped with `fn`.
	 *
	 * @param {String} str
	 * @param {Array} props
	 * @param {Function} fn
	 * @return {String}
	 * @api private
	 */
	
	function map(str, props, fn) {
	  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
	  return str.replace(re, function(_){
	    if ('(' == _[_.length - 1]) return fn(_);
	    if (!~props.indexOf(_)) return _;
	    return fn(_);
	  });
	}
	
	/**
	 * Return unique array.
	 *
	 * @param {Array} arr
	 * @return {Array}
	 * @api private
	 */
	
	function unique(arr) {
	  var ret = [];
	
	  for (var i = 0; i < arr.length; i++) {
	    if (~ret.indexOf(arr[i])) continue;
	    ret.push(arr[i]);
	  }
	
	  return ret;
	}
	
	/**
	 * Map with prefix `str`.
	 */
	
	function prefixed(str) {
	  return function(_){
	    return str + _;
	  };
	}


/***/ }
/******/ ])
//# sourceMappingURL=main.bundle.js.map