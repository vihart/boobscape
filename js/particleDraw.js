
var debug = false;

var hands = [];
var colorArray = [];
var brushArray = [];
var velocities = [];
var s = 0;

var gravity = -0.0001;

var vrModeGamePadButtonPressed = false; // because of annoying way gamepad buttons work
var pressedController = -1;

function prepSparkles(sparkleNumber){
	//make particles
	var sparkleGeom = new THREE.Geometry();

	for (var i = 0; i<sparkleNumber; i++){
	var part = new THREE.Vector3(
	      Math.random(),
	      Math.random(),
	      Math.random()
	  );
	velocities[i] = new THREE.Vector3(0,0,0);
	sparkleGeom.vertices.push(part);
	}

	var sparkleMat = new THREE.PointCloudMaterial({size:0.02});
	sparkleMat.color.setRGB(1,0.5,0.8);
	var sparkles = new THREE.PointCloud(sparkleGeom, sparkleMat);

	sparkles.sortParticles = true;
	sparkles.frustumCulled = false;

	return sparkles;
}


function drawSparkle(s){
	// HANDS!!!!
	for (j in controls.controllers) {
		if(debug) {
			console.time("controls");
		}


		var handControl = controls.controllers[j]
		if (!hands[j]) {
			//create a new hands[j] for each controller
			hands[j] = new THREE.Mesh(new THREE.OctahedronGeometry(.05), new THREE.MeshBasicMaterial({color: 0xEE0443, wireframe: true}));
			scene.add(hands[j]);
			colorArray[j] = new THREE.Color(1, 1/(2*(j+1)), 1/(2*j+1));
			hands[j].material.color.setRGB(colorArray[j].r, colorArray[j].g, colorArray[j].b);
			brushArray[j] = 1;
		}
		if(handControl.pose){ //set hand vis at controller location
			hands[j].position.set(handControl.pose.position[0], handControl.pose.position[1], handControl.pose.position[2]);
			hands[j].quaternion.set(handControl.pose.orientation[0],handControl.pose.orientation[1],handControl.pose.orientation[2],handControl.pose.orientation[3]);
		}

		if (handControl.pose && handControl.buttons[3].pressed) { // enter VR mode
			pressedController = j;
			vrModeGamePadButtonPressed = true;
		} else if (vrModeGamePadButtonPressed && pressedController === j) {
			vrModeGamePadButtonPressed = false;
			pressedController = -1;
			vrMode = !vrMode;
			effect.setVRMode(vrMode);
		}

		if (handControl.pose && handControl.buttons[1].pressed) { //draw stuff
		var thisSparkle = s%sparkleNumber;	//get blob to be drawn
		velocities[thisSparkle] = new THREE.Vector3(
			Math.random()/100 - 0.001,
			Math.random()/100 - 0.001,
			Math.random()/100 - 0.001
			);
		sparkles.geometry.vertices[thisSparkle] = new THREE.Vector3(
			handControl.pose.position[0] + Math.random()/10, 
			handControl.pose.position[1] + Math.random()/10, 
			handControl.pose.position[2] + Math.random()/10
			);	//position new sparkle
	}

		if(debug) {
			console.timeEnd("controls");
			console.log(handControl.pose.position);
		}
	}
}	

function sparkleUpdate(){
	for (var i = 0; i < sparkleNumber; i++){
		velocities[i].y += gravity;
		sparkles.geometry.vertices[i].x += velocities[i].x;
		sparkles.geometry.vertices[i].y += velocities[i].y;
		sparkles.geometry.vertices[i].z += velocities[i].z;
	}
}