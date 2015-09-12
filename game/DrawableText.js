OE.DrawableText = function(text) {
	OE.GameObject.call(this);
	
	this.mText = text;
	this.mFont = "Arial";
	this.mColor = new OE.Color(1.0, 1.0, 1.0);
	this.updateVBO();
};
OE.DrawableText.prototype = {
	mText: "",
	mFont: "",
	mColor: undefined,
	
	mVertexData: undefined,
	
	setText: function(text) {
		this.mText = text;
		this.updateVBO();
	},
	setFont: function(font) {
		this.mFont = font;
		this.updateVBO();
	},
	setColor: function(color) {
		this.mColor = color;
		this.updateVBO();
	},
	
	updateVBO: function() {
		
	},
};
OE.Utils.defClass(OE.DrawableText, OE.GameObject, OE.Renderable);
