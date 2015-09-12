var Application = function() {
	OE.BaseApp3D.call(this);
};
Application.prototype = {
	onRun: function() {
		this.mRenderSystem = new OE.RenderSystem();
		
		var container = document.getElementById("appFrame");
		this.mSurface = this.mRenderSystem.createRenderSurface(container);
		
		this.mScene = new OE.Scene();
		this.mScene.setRenderSystem(this.mRenderSystem);
		this.mCamera = new OE.ForceCamera(this.mScene);
		this.mViewport = this.mSurface.createViewport(this.mCamera);
		
		this.loadResources();
	},
	loadResources: function() {
		OE.ResourceManager.declareLibrary("data/MyLibrary.json", function() {
		OE.ResourceManager.declareLibrary("data/Default/Library.json", function() {
		OE.ResourceManager.declareLibrary("data/Lamborghini/Lib.json", function() {
		
			this.initScene();
		
		}.bind(this));
		}.bind(this));
		}.bind(this));
	},
	initScene: function() {
		this.mCamera.setPosf(0.0, 0.0, 0.0);
		this.mScene.addObject(this.mCamera);
		
		var obj = new OE.Entity("Lamborghini");
		obj.setScalef(0.125, 0.125, 0.125);
		this.mScene.addObject(obj);
		
		var obj = this.mScene.addObject(new OE.TerrainPatch(100.0, 100.0, 16, 16));
		obj.mMaterial = OE.MaterialManager.getLoaded("DefaultWhite");
		
		this.player = new Agent();
		this.mScene.addObject(this.player);
		
		var fb = new FacebookManager();
		var app = this;
		fb.init(function() {
			fb.getFriends(20, function(data) {
				app.addPeople(data);
			});
		});
	},
	
	addPeople: function(people) {
		// Add a new NPC Agent for each person.
		for (var i=0; i<people.length; i++) {
			var fbData = people[i];
			var name = fbData.name;
			var agent = new NpcAgent(name, fbData);
			this.mScene.addObject(agent);
		}
	},
	
	onMouseWheel: function(delta) {
		this.camDist += -0.25 * delta / Math.abs(delta);
	},
	onMouseDown: function(x, y, k) {
		this.xprev = x;
		this.yprev = y;
	},
	
	xprev: 0, yprev: 0,
	onMouseMove: function(x, y) {
		if (this.mMouseDown[0]) {
			var k = 0.1;
			
			// Get mouse deltas.
			var dx = x - this.xprev;
			var dy = y - this.yprev;
			this.xprev = x;
			this.yprev = y;
			
			// Perform mouselook.
			// TODO: set last parameter to true, and implement axis locking.
			this.mCamera.mouseLook(-dx, -dy, k, false);
		}
	},
	
	camDist: 6.0,
	rota: new OE.Quaternion(),
	a: new OE.Vector3(),
	onUpdate: function() {
		if (this.player) {
			// WASD/FR controls, QE swivel.
			var ax = 0.0, ay = 0.0, az = 0.0, aRot = 0.0;
			if (this.mKeyDown[OE.Keys.A]) ax -= 1.0;
			if (this.mKeyDown[OE.Keys.D]) ax += 1.0;
			if (this.mKeyDown[OE.Keys.F]) ay -= 1.0;
			if (this.mKeyDown[OE.Keys.R]) ay += 1.0;
			if (this.mKeyDown[OE.Keys.W]) az -= 1.0;
			if (this.mKeyDown[OE.Keys.S]) az += 1.0;
			
			if (this.mKeyDown[OE.Keys.Q]) aRot -= 1.0;
			if (this.mKeyDown[OE.Keys.E]) aRot += 1.0;
			
			if (ax !== 0.0 || ay !== 0.0 || az !== 0.0) {
				// Run or walk?
				var speed = this.mKeyDown[16] ? 1.0 : 0.1;
				
				this.a.setf(-ax, -ay, -az);
				this.player.walk(this.a, speed, true);
			}
			
			if (aRot !== 0.0) {
				this.rota.fromAxisAngle(OE.Vector3.FORWARD, aRot);
				this.mCamera.rotAccel(this.rota);
			}
			
			// Set camera behind player in opposite direction of camera rotation.
			var pos = this.mCamera.getPos();
			pos.set(this.player.getPos());
			this.a.set(this.mCamera.getRot().getConjugate().getForward());
			this.a.mulByf(this.camDist);
			pos.addBy(this.a);
			pos.y += 0.75;
			this.mCamera.setPos(pos);
			
			// Make player try to face camera rotation.
			var pos = this.a;
			pos.mulByf(-1.0);
			pos.addBy(this.player.getPos());
			this.player.facePos(pos);
		}
	}
};
OE.Utils.defClass(Application, OE.BaseApp3D);
