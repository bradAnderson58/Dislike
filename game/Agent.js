var Agent = function(name, userData) {
	OE.GameObject.call(this);
	this.mName = name === undefined ? "Agent" : name;
	this.mUserData = userData;
	
	this.velocity = new OE.Vector3();
};
Agent.prototype = {
	mUserData: undefined,
	mName: "",
	
	velocity: undefined,
	friction: 0.75,
	facingAngle: 0.0,
	targetAngle: 0.0,
	walkSpeed: 0.01,
	runSpeed: 0.05,
	
	onCreate: function() {
		// Add a sphere for body.
		var obj = this.addChild(new OE.Sphere(1.0, 12));
		obj.mMaterial = OE.MaterialManager.getLoaded("DefaultWhite");
		
		// Add a sphere forward, to mark facing direction.
		obj = this.addChild(new OE.Sphere(0.5, 8));
		obj.setPosf(0.0, 0.0, 1.0);
		obj.mMaterial = OE.MaterialManager.getLoaded("DefaultWhite");
		
		// Random position.
		this.setPosf(Math.random() * 100.0 - 50.0, 1.0,
					 Math.random() * 100.0 - 50.0);
	},
	
	turn: function(angleDelta) {
		this.targetAngle += angleDelta;
	},
	faceAngle: function(angle) {
		this.targetAngle = angle;
	},
	facePos: function(pt) {
		var pos = this.getPos();
		var dx = pt.x - pos.x;
		var dz = pt.z - pos.z;
		if (dx !== 0.0 || dz !== 0.0) {
			var d = Math.sqrt(dx*dx+dz*dz);
			this.targetAngle = Math.atan2(dx/d, dz/d);
		}
	},
	walk: function(direction, speed, local) {
		direction.y = 0.0;
		direction.normalize();
		if (local === true)
			this.getRot().mulvBy(direction);
		direction.mulByf(OE.Math.linInterp(this.walkSpeed, this.runSpeed, speed));
		this.velocity.addBy(direction);
	},
	
	onUpdate: function() {
		var pos = this.getPos();
		pos.addBy(this.velocity);
		this.velocity.mulByf(this.friction);
		this.setPos(pos);
		
		while (this.facingAngle < -OE.Math.TWO_PI) this.facingAngle += OE.Math.TWO_PI;
		while (this.facingAngle >= OE.Math.TWO_PI) this.facingAngle -= OE.Math.TWO_PI;
		while (this.targetAngle < -OE.Math.TWO_PI) this.targetAngle += OE.Math.TWO_PI;
		while (this.targetAngle >= OE.Math.TWO_PI) this.targetAngle -= OE.Math.TWO_PI;
		
		if (this.facingAngle !== this.targetAngle) {
			var diff = this.targetAngle - this.facingAngle;
			var delta = Math.atan2(Math.sin(diff), Math.cos(diff));
			diff = Math.abs(delta);
			delta = delta / diff;
			this.facingAngle += delta * 0.05;
			if (diff < 0.1) {
				this.facingAngle = this.targetAngle;
			}
		}
		var rot = this.getRot();
		rot.fromAxisAngle(OE.Vector3.UP, this.facingAngle*OE.Math.RAD_TO_DEG);
		this.setRot(rot);
	}
};
OE.Utils.defClass(Agent, OE.GameObject);
