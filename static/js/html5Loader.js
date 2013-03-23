/*
Jeremy Bernstein
3/11/2013
*/
var paused = false;

var delta;
var clock = new THREE.Clock();

var renderer,
    camera,
    scene,
    projector;

var videoScene;

var initWebGL = function(){
    setupInput();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    $(renderer.domElement).attr("id", "renderer");
//    $('#content3d').append(renderer.domElement);
    // document.body.appendChild( renderer.domElement );
    console.log("renderer created");


    var canvas = document.createElement( 'div' );
    $('#content3d').append( canvas );

    var devicePixelRatio = window.devicePixelRatio || 1;

    renderer.setSize( window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio );
    renderer.domElement.style.width = $('body').innerWidth() + 'px';
    renderer.domElement.style.height = window.innerHeight * devicePixelRatio - $('#footer').height() + 'px';


    canvas.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    makeScene();

    animateThree();
}

var makeScene = function(){
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;
    camera.position.y = 20;
//    camera.rotation.x = degreeToRad(-10);
    
    projector = new THREE.Projector();
    
    scene = new THREE.Scene();
    
    videoScene = new VideoScene(scene);
    renderer.render(scene,camera);
}

animateThree = function(){
    requestAnimationFrame( animateThree );
    if(!paused){
        delta = clock.getDelta();
        
        videoScene.update();

        camera.position.x += ( (mouseX/6) - camera.position.x ) * .005;
        camera.position.y += ( - (mouseY/6) - camera.position.y ) * .005;

        camera.lookAt( scene.position );

        
        renderer.render( scene, camera );
        

    }
}

onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight ); 
    renderer.domElement.style.width = $('body').innerWidth() + 'px';
    renderer.domElement.style.height = window.innerHeight * devicePixelRatio - $('#footer').height() + 'px';
}