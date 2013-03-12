// Jeremy Bernstein

VideoScene = function(scene){
	this.scene = scene; //THREE scene
	this.scene.fog = new THREE.Fog( 0x000000, 100, 450 );

	this.videos = [];
	this.clickables = [];
	
	this.light = new THREE.DirectionalLight( 0xffffff );
	this.light.position.set( 0.5, 1, 1 ).normalize();
	scene.add( this.light );
	
//	this.particleSystem = new ParticleSystem(this.scene);
	
	this.cubes = new Cubes(this.scene, this.clickables);
	

	
	
	this.update = function(){
//		this.particleSystem.update();
		this.cubes.update();
	}
	
	
	this.addVideo = function(video){
		
		this.videos.push(vid);
	}
	
	//loader
	
	
	this.mousedown = function(event){
		
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );
		var raycaster = new THREE.Raycaster( camera.position, vector.sub(vector, camera.position ).normalize() );
		var intersects = raycaster.intersectObjects(videoScene.clickables);
		if ( intersects.length > 0 ) {
			console.log(intersects[ 0 ]);
			launchVideo(intersects[0].object.video);
		} 
	}
	
	
}

ParticleSystem = function(scene){
	this.scene = scene;

	var particles;
	var geometry = new THREE.Geometry();
	var materials = [];
	var color;
	
	for (var i = 0; i < 100; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = (Math.random()-0.5) * 600;
		vertex.y = (Math.random()-0.5) * 600;
		vertex.z = (Math.random()-0.5) * 600;

		geometry.vertices.push( vertex );
	}

	var parameters = [ [ [1.0, 1.0, 1.0], 5 ], [ [0.95, 1, 1], 4 ], [ [0.90, 1, 1], 3 ], [ [0.85, 1, 1], 2 ], [ [0.80, 1, 1], 1 ] ];

	for ( i = 0; i < parameters.length; i ++ ) {

		var size  = parameters[i][1] * 200;
		color = parameters[i][0];
		
		materials[i] = new THREE.ParticleBasicMaterial( 
				{ size: size, 
					map: THREE.ImageUtils.loadTexture( 'images/cloud.png' ), 
					color: 0xE1E1FF,
					transparent: true,
					depthWrite: false
					} ); 

		particles = new THREE.ParticleSystem( geometry, materials[i] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		this.scene.add( particles );
	}
	
	this.update = function(){
		
		for ( i = 0; i < this.scene.children.length; i ++ ) {
			var object = scene.children[ i ];

			if ( object instanceof THREE.ParticleSystem ) {
				object.rotation.y = time/100000 * ( i < 4 ? i + 1 : - ( i + 1 ) );
			}
		}
	}
}

Cubes = function(scene, clickables){

	this.state = "idle";
	var nextVid;
	
	var cube_count;
	
	var cubeSpeed = .02;
	var cubeDistance = 25;
	
	var meshes = [];
	var materials = [];

	var group = new THREE.Object3D();

	var xgrid = 20;
	var ygrid = 10;
	
	var texture = new THREE.Texture();
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	texture.generateMipmaps = false;

	//
	
	this.change_uvs = function( geometry, unitx, unity, offsetx, offsety ) {

		var i, j, uv;

		for ( i = 0; i < geometry.faceVertexUvs[ 0 ].length; i++ ) {

			uv = geometry.faceVertexUvs[ 0 ][ i ];

			for ( j = 0; j < uv.length; j++ ) {

				uv[j].x = ( uv[j].x + offsetx ) * unitx;
				uv[j].y = ( uv[j].y + offsety ) * unity;

			}

		}

	}

	var i, j, ux, uy, ox, oy,
		geometry,
		xsize, ysize;

	ux = 1 / xgrid;
	uy = 1 / ygrid;

	xsize = 480 / xgrid;
	ysize = 204 / ygrid;

	var parameters = { color: 0xffffff, map: texture },
		material_base = new THREE.MeshBasicMaterial( parameters );

	renderer.initMaterial( material_base, scene.__lights, scene.fog );

	cube_count = 0;

	for ( i = 0; i < xgrid; i ++ )
	for ( j = 0; j < ygrid; j ++ ) {

		ox = i;
		oy = j;

		geometry = new THREE.CubeGeometry( xsize, ysize, xsize );
		this.change_uvs( geometry, ux, uy, ox, oy );

		materials[ cube_count ] = new THREE.MeshBasicMaterial( parameters );

		material = materials[ cube_count ];

		material.hue = i/xgrid;
		material.saturation = 1 - j/ygrid;

//		material.color.setHSV( material.hue, material.saturation, 1 );

		mesh = new THREE.Mesh( geometry, material );

		mesh.position.x =   ( i - xgrid/2 ) * xsize;
		mesh.position.y =   ( j - ygrid/2 ) * ysize;
		mesh.position.z = 0;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

		clickables.push(mesh);
		group.add( mesh );

		
		// POSITION INIT
		mesh.dx = cubeSpeed * ( 0.5 - Math.random() );
		mesh.dy = cubeSpeed * ( 0.5 - Math.random() );
		mesh.dz = -cubeSpeed * ( 1+ 0.5 * Math.random() );
		

		mesh.rotation.x += 10 * mesh.dx * cubeDistance;
		mesh.rotation.y += 10 * mesh.dy * cubeDistance;
		

		mesh.position.x += 200 * mesh.dx * cubeDistance;
		mesh.position.y += 200 * mesh.dy * cubeDistance;
		mesh.position.z += 400 * mesh.dz * cubeDistance;

		mesh.dx = mesh.dx *-1;
		mesh.dy = mesh.dy *-1;
		mesh.dz = mesh.dz *-1;
		
		
		meshes[ cube_count ] = mesh;

		cube_count += 1;

	}
	
	scene.position.x = -50;
	scene.add(group);

	this.positionCounter = 0;
	
	this.animateIdle = function(){
	}
	
	this.animateFocus = function(){
		
	}
	
	this.animateApproaching = function(){
		this.positionCounter++;
		for (var i = 0; i < meshes.length; i ++ ) {

			var mesh = meshes[ i ];

			mesh.rotation.x += 10 * mesh.dx;
			mesh.rotation.y += 10 * mesh.dy;
			

			mesh.position.x += 200 * mesh.dx;
			mesh.position.y += 200 * mesh.dy;
			mesh.position.z += 400 * mesh.dz;

			if(this.positionCounter >= cubeDistance){
				mesh.dx = mesh.dx *-1;
				mesh.dy = mesh.dy *-1;
				mesh.dz = mesh.dz *-1;
				
				this.state = "focus";
			}
		}
	}
	
	this.animateReturning = function(){
		this.positionCounter--;
		for (var i = 0; i < meshes.length; i ++ ) {

			var mesh = meshes[ i ];

			mesh.rotation.x += 10 * mesh.dx;
			mesh.rotation.y += 10 * mesh.dy;
			

			mesh.position.x += 200 * mesh.dx;
			mesh.position.y += 200 * mesh.dy;
			mesh.position.z += 400 * mesh.dz;

			if(this.positionCounter <= 0){
				mesh.dx = mesh.dx *-1;
				mesh.dy = mesh.dy *-1;
				mesh.dz = mesh.dz *-1;
				
				//this.state = "idle";
				if(this.state == "returning"){
					this.state = "idle"
					this.changeVideo(nextVid);
				}else if(this.state == "closing"){
					this.state = "idle"
				}
			}
		}
	}
	
	this.update = function(){
		if(this.state == "idle")
			this.animateIdle();
		else if(this.state == "focus")
			this.animateFocus();
		else if(this.state == "approaching")
			this.animateApproaching();
		else if(this.state == "returning" || this.state == "closing")
			this.animateReturning();
	}

	this.changeVideo = function(video){
		var tex = video.videoTexture;
		nextVid = video;
		
		if(this.state == "idle"){
			for(i in materials){
				materials[i].map = tex;
				meshes[i].video = video;
			}
			this.state = "approaching";
		} else if(this.state == "focus"){
			this.state = "returning";
		}
	}
}


function getLines(ctx,phrase,maxPxLength,textStyle) {
    var wa=phrase.split(" "),
        phraseArray=[],
        lastPhrase=wa[0],
        l=maxPxLength,
        measure=0;
    ctx.font = textStyle;
    for (var i=1;i<wa.length;i++) {
        var w=wa[i];
        measure=ctx.measureText(lastPhrase+w).width;
        if (measure<l) {
            lastPhrase+=(" "+w);
        }else {
            phraseArray.push(lastPhrase);
            lastPhrase=w;
        }
        if (i===wa.length-1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
}

