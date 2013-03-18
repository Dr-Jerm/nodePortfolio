var mouseX = 0;
var mouseY = 0;

var mouseDown = false;


function setupInput(){
	
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    window.addEventListener( 'resize', onWindowResize, false );
    
    $(document).mousedown( function(event) {
    	var elemID = (event.target || event.srcElement).id;
//    	console.log(elemID);
    	mouseDown = true;
    	if(elemID == "renderer")
    		videoScene.mousedown(event);
//    	event.preventDefault();
    	
    });
    
    
    $(document).mouseup(function() {
    	mouseDown = false;
    });
  
    $(window).mousemove(function(event) {
        mouseX = ( event.clientX - window.innerWidth / 2 );
        mouseY = ( event.clientY - window.innerHeight / 2 );
    });

    
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }