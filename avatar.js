//META{"name":"AvatarHover"}*//

var _fs = require("fs");

var AvatarHover  = function() {
	this.load = function() {
		this.loadSettings();
		this.appendContainer();

		var that = this;
		$(window).keydown(function(event) {
			if(event.which == 17) that.isShown = true;
			if(event.which == 16) that.isLarge = true;
		});

		$(window).keyup(function(event) {
			if(event.which == 17) that.isShown = false;
			if(event.which == 16) that.isLarge = false;
		});

		$(window).blur(function() {
			that.isShown = false;
			that.isLarge = false;
		});
	};
	this.unload = function() {
		this.saveSettings();
	};

	this.start = function() {
	    this.isRunning = true;
		this.run();
	};

	this.stop = function() {
		this.isRunning = false;
	};

	this.onSwitch = function() {
		this.run();
	};

	this.onMessage = function() {
		this.run();
	};

	this.getSettingsPanel = function() {
		return this.getPanel();
	};

	this.getName = function() {
		return "AvatarHover";
	};

	this.getDescription = function() {
		return "When hovering Avatar use Ctrl / Ctrl+Shift";
	};

	this.getAuthor = function() {
		return "noVaLue";
	};

	this.getVersion = function() {
		return "Version 0.1.1";
	};
};

AvatarHover.prototype.settings = {
	"isShown": false,
	"isLarge": false,
	"avatarBackgroundColor":"#303336",
	"avatarBorderRadius": "4px",
	"avatarBorderSize": "1px",
	"avatarBorderColor": "black"	
};

AvatarHover.prototype.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

AvatarHover.prototype.isRunning = false;
AvatarHover.prototype.isShown = false;
AvatarHover.prototype.isLarge = false;

AvatarHover.prototype.run = function() {
	if(this.isRunning) this.init();
};

AvatarHover.prototype.appendContainer = function () {
	var that = this;
	var elem = $("<div id='AvatarHover'>");
	elem.css({
		"display:":"none", "background-size": "cover",
		"position":"absolute", "zIndex":"99999"
	});
	$("body").append(elem);
};

AvatarHover.prototype.init = function() {
	var that = this;

	$("div.avatar-large,div.avatar-small").each(function(id, elem) {
		if($(this).data("customShowAvatar"))
			return;

		$(this).data("customShowAvatar", true);

		$(this).mouseenter(function() {
			if(that.isRunning && (that.isShown || that.settings['isShown'])) {
				that.setAvatarSize($(this));

				$("#AvatarHover").css({
					"display":"block", 
					"background-color": that.settings['avatarBackgroundColor'],
					"border-radius": that.settings['avatarBorderRadius'], 
					"border": that.settings['avatarBorderSize'] +  " solid "+
								that.settings['avatarBorderColor'],
					"background-image": $(this).css("background-image")
				});
			}
		});

		$(this).mouseleave(function() {
			if(that.isRunning)
				$("#AvatarHover").css({"display":"none"});
		});
	});
};

AvatarHover.prototype.setAvatarSize = function(self) {
	var newWidth = this.isLarge || this.settings['isLarge'] ? 256 : 128, 
		newHeight = this.isLarge || this.settings['isLarge'] ? 256 : 128;

	var offset = self.offset();
	var width = self.width();
	var height = self.height();

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	var AvatarX = offset.left + (width - newWidth)/2;
	var AvatarY = windowHeight-height < offset.top + newHeight ? offset.top - newHeight : offset.top + height;
	AvatarX = AvatarX < 0 ? 0 : AvatarX;
	AvatarX = AvatarX + width > windowWidth ? windowWidth - width : AvatarX;

	$("#AvatarHover").css({
		"top": AvatarY + "px",
		"left": AvatarX + "px",
		"width": newWidth + "px",
		"height": newHeight + "px"
	});
};

AvatarHover.prototype.setSettings = function() {
	var bgColor = $('#avatarBGColor').val();
	var borderRad = $('#avatarBorderRadius').val();
	var borderSize = $('#avatarBorderSize').val();
	var borderColor = $('#avatarBorderColor').val();

	this.settings['isShown'] = $('#avatarIsShown').is(':checked');
	this.settings['isLarge'] = $('#avatarIsLarge').is(':checked');
	this.settings['avatarBackgroundColor'] = bgColor == "" ? "#303336": bgColor;
	this.settings['avatarBorderRadius'] = borderRad == "" ? "4px": borderRad;
	this.settings['avatarBorderSize'] = borderSize == "" ? "1px": borderSize;
	this.settings['avatarBorderColor'] = borderColor == "" ? "black": borderColor;

	this.saveSettings();

	$("#bd-psm-id").remove();
};

AvatarHover.prototype.saveSettings = function() {
	var settings = this.getSettingsFile();
    try { _fs.writeFileSync(settings, JSON.stringify(this.settings)); }catch(ex) {}
};

AvatarHover.prototype.loadSettings = function() {
	var settings = this.getSettingsFile();
	try { 
		var tmpSettings = JSON.parse(_fs.readFileSync(settings)); 

		if(this.size(this.settings) == this.size(tmpSettings))
			this.settings = tmpSettings;
	}catch(ex) {}
};

AvatarHover.prototype.getSettingsFile = function() {
	var _os = process.platform;
	var _dataPath = _os == "win32" ? process.env.APPDATA : _os == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local';
    _dataPath += "/BetterDiscord";
    _userFile = _dataPath + "/avatar.json";
    return _userFile;
};

AvatarHover.prototype.getPanel = function() {
	 return '<style>' +
		'table#avatarSettings { margin:30px; margin-top:70px; padding-top:20px }'+
		'table#avatarSettings td:last-child { text-align:center }'+
		'table button { text-weight:bold; background-color: #BFF5F7 }'+
		'table button:hover { background-color: #97E6B2 }'+
		'</style>' +
		'<table id="avatarSettings" width="90%">' +
		'<tr><td width="50%"><label for="avatarBGColor">Avatar BG Color: </label></td>'+
				'<td><input type="text" placeholder="#012345" id="avatarBGColor" value="'+
				this.settings['avatarBackgroundColor']+
				'"></td></tr>' + 
        '<tr><td><hr></td><td></td></tr>'+
        '<tr><td><label for="avatarBorderRadius">Avatar BorderRadius: </label></td>'+
				'<td><input type="text" placeholder="0px" id="avatarBorderRadius" value="'+
				this.settings['avatarBorderRadius']+
				'"></td></tr>' + 
		'<tr><td><hr></td><td></td></tr>'+
       	'<tr><td><label for="avatarBorderSize">Avatar BorderSize: </label></td>'+
				'<td><input type="text" placeholder="1px" id="avatarBorderSize" value="'+
				this.settings['avatarBorderSize']+
				'"></td></tr>' + 
		'<tr><td><hr></td><td></td></tr>'+
    	'<tr><td><label for="avatarBorderColor">Avatar BorderColor: </label></td>'+
				'<td><input type="text" placeholder="0px" id="avatarBorderColor" value="'+
				this.settings['avatarBorderColor']+
				'"></td></tr>' + 
    	'<tr><td><hr></td><td></td></tr>'+
    	'<tr><td><label for="avatarIsShown">Avatar Force Show: </label></td>'+
				'<td><input type="checkbox" id="avatarIsShown" '+
				(this.settings['isShown'] ? "checked": "")+
				'></td></tr>' + 
    	'<tr><td><hr></td><td></td></tr>'+
    	'<tr><td><label for="avatarIsLarge">Avatar Force Large: </label></td>'+
				'<td><input type="checkbox" id="avatarIsLarge" '+
				(this.settings['isLarge'] ? "checked": "")+
				'></td></tr>' + 
    	'<tr><td><hr></td><td><hr></td></tr>'+
    	'<tr><td></td><td>'+
    	'<button '+
       		'style="border:1px solid blue"'+
        	'onclick="BdApi.getPlugin(\'AvatarHover\').setSettings()"'+
        '>Apply</button></td></tr></table>';
};