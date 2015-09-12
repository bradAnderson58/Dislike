var Nametag = function(name, userData) {
	OE.GameObject.call(this);
};
Nametag.prototype = {
	
	onCreate: function() {
		Agent.prototype.onCreate.call(this);
		
		this.target = new OE.Vector2();
		this.findNewTarget();
	},
	
	onUpdate: function() {
		Agent.prototype.onUpdate.call(this);
		var pos = this.getPos();
		var dx = this.target.x - pos.x;
		var dy = this.target.y - pos.z;
		var d2 = dx*dx + dy*dy;
		
		if (d2 < 10.0) {
			if (Math.random() < 0.0015) {
				this.findNewTarget();
			}
		}
		else {
			var d = Math.sqrt(d2);
			var nx = dx/d;
			var ny = dy/d;
			pos.x += nx * this.speed;
			pos.z += ny * this.speed;
			this.setPos(pos);
		}
	},
	
	findNewTarget: function() {
		this.target.setf(Math.random() * 200.0 - 100.0,
						 Math.random() * 200.0 - 100.0);
	}
};
OE.Utils.defClass(Nametag, OE.GameObject);
