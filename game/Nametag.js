var Nametag = function() {
	OE.GameObject.call(this);
};
Nametag.prototype = {
	onCreate: function() {
		//this.addChild(new OE.DrawableText(this.name));
	},
	onUpdate: function() {
	}
};
OE.Utils.defClass(Nametag, OE.GameObject);
