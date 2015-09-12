var NpcAgent = function(name, userData) {
	Agent.call(this, name, userData);
};
NpcAgent.prototype = {
	target: undefined,
	
	onCreate: function() {
		Agent.prototype.onCreate.call(this);
		
		this.target = new OE.Vector3();
		this.findNewTarget();
	},
	
	onUpdate: function() {
		Agent.prototype.onUpdate.call(this);
		var pos = this.getPos();
		var dx = this.target.x - pos.x;
		var dy = this.target.z - pos.z;
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
			this.walk(OE.Vector3.FORWARD, 0.0, true);
			this.facePos(this.target);
		}
	},
	
	findNewTarget: function() {
		this.target.setf(Math.random() * 100.0 - 50.0, 0.0,
						 Math.random() * 100.0 - 50.0);
	}
};
OE.Utils.defClass(NpcAgent, Agent);
