

	var boobTime = 0.001;
	var boobSpeed = 0.1*Math.random();

function generateBoobscape(seed){ //seed is a random number between 0 and 1. Math.random();
	var boobscape = new THREE.Object3D();

	//boobs
	var planeGeometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );
	var planeMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe:false} );
	var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.rotation.x = -pi/2;
	plane.position.set(0.01, -5, 0.01);
	boobscape.add( plane );

	for (var i = 0; i < plane.geometry.vertices.length; i++){
	  var planeX = plane.geometry.vertices[i].x;
	  var planeY = plane.geometry.vertices[i].y;
	  var planeHeight = boobFunction(planeX, planeY);

	  plane.geometry.vertices[i].z = planeHeight;

	};

	return boobscape;

}

function boobFunction(x, y){
	var period1 = 1/(7%(100*seed));
	var period2 = 1/(7%(1000*seed));
	var height = 6 * Math.abs(seed*Math.sin(x*period1) - seed*Math.sin(y*period2));
	var top = 12*Math.abs(seed);
	if ((top - height) < (top/12)){
		if ((top - height) < (top/20)){
			height += 1 + seed;	
		}	
		height += top/5 + seed/2;
	}
	return height;
}

function bounce(){
	for (var i = 0; i < boobscape.children[0].geometry.vertices.length; i++){
	var top = 12*Math.abs(seed);
		var height = 6 * Math.abs(seed*Math.sin(boobscape.children[0].geometry.vertices[i].x*(1/(7%(100*seed)))) - seed*Math.sin(boobscape.children[0].geometry.vertices[i].y*(1/(7%(1000*seed)))));
		boobscape.children[0].geometry.vertices[i].z += 5*Math.sin(boobTime)/(100*(top-(top/10))/height);
	}
  	boobscape.children[0].geometry.verticesNeedUpdate=true;
	boobTime += boobSpeed;
}