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
	  var planeHeight = boobFunction(planeX, planeY, seed);

	  plane.geometry.vertices[i].z = planeHeight;

	};

	return boobscape;

}

function boobFunction(x, y, seed){
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