var player;
var currVid = 'nHYbdPfb9Yk';

(function($) {
    

	console.log("up and running");

})(jQuery);

function launchVideo(video){
	currVid = video.youtubeCode;

	$('#contentTitle').html(video.title);
	$('#contentSubTitle').html(video.subTitle);
	$('#contentBody').html(video.description);
	$('#contentResponsiblities').empty();
	for(i in video.credits){
		$('#contentResponsiblities').append('<li>'+video.credits[i]+'</li>');
	}
	$('#contentLinks').empty();
	for(i in video.links){
		$('#contentLinks').append('<li>'+video.links[i]+'</li>');
	}
	$('#content_modal').modal('show');
}