//META{"name":"MyAwesomePlugin"}*//

var MyAwesomePlugin = function () {
	this.getName = function(){ return "Test Plugin"; }
	this.getDescription = function(){ return "Test Plugin Description."; }
	this.getVersion = function(){ return "0.0.1"; }
	this.getAuthor = function(){ return "noVaLue"; }
};

MyAwesomePlugin.prototype.load = function () {
	// This calls when the plugin is charged first time
};
MyAwesomePlugin.prototype.unload = function () {
	// This should remove every modification you've made on discord (if any)
};

MyAwesomePlugin.prototype.start = function () {
	// When you activate the plugin it gets called, 
	// also when plugin calls load() first time
};

MyAwesomePlugin.prototype.stop = function () {
	// Called on plugin desactivation
};

MyAwesomePlugin.prototype.onMessage = function () {
    // called when a message is received
};

MyAwesomePlugin.prototype.onSwitch = function () {
    // called when a server or channel is switched
};

MyAwesomePlugin.prototype.observer = function (e) {
    // raw MutationObserver event for each mutation
};

MyAwesomePlugin.prototype.getSettingsPanel = function () {
    return "<h3>Settings Panel</h3>";
};



// To export this object constructor which is required

try{exports.MyAwesomePlugin = MyAwesomePlugin;}catch(e){console.warn('Using old version, not exporting functions.')}

/* For a API like plugin some modifications have to be made 

	1. The main function (class) has to be global

		var MyAwesomePlugin = function () {};

		BECOMES

		MyAwesomePlugin = function () {};

	2. You have to use the prototype object, your functions
		are going to get exported through that object and you'll have to use

		MyAwesomePlugin.prototype.OneofThefunctions();

		INSTEAD you can use.

		MyAwesomePlugin.OneofThefunctions() = function() {
			return this.prototype.OneofThefunctions();
		};

	3. Anytime you use .prototype.namevar or .prototype.namefunc , these get
		created inside the 'prototype' object called by the 'main class' which
		extends object (in our case MyAwesomePlugin).

	4. This kind of function 
			MyAwesomePlugin.OneofThefunctions()

		can be used inside of 
			MyAwesomePlugin = function () {
				MyAwesomePlugin.OneofThefunctions();
			};

		But this is useless, as long you're in the sandbox of nodejs (<script> </script>)

			MyAwesomePlugin = function () {
				this.OneofThefunctions();
			};

			MyAwesomePlugin = function () {
				this.prototype.OneofThefunctions();
			};

		are the same.

		:WARNING:
			'MyAwesomePlugin' different than 'this'
*/
