$(document).ready(function(){
    var window_height =  $("body").css('height');
    document.addEventListener("DOMFocusIn", function(event) {
        $("body").css('height', window_height);
    }, false);
});