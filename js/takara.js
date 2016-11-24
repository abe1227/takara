$(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
});

// トップページ
$('.title-start-img').click(function() {
	//localStorage.removeItem("name");
	var name = localStorage.getItem("name");
	if (name == null) {
		window.location.href = "name_input.html";
	} else {
		window.location.href = "map.html";
	}
});

// 名前入力,名前使用不可
$('.gaiok-ok').click(function(){
	var name = $('.name-text').val();
	if ( space(name) ) {
		$('.error-msg').text('未入力です');
	} else if( text_check(name) ){
		$('.error-msg').text('ひらがな、英字のみ使用可能です');
	} else if( length(name,9) ){
		$('.error-msg').text('8文字以内で入力してください');
	} else {
		console.log('おっけーーー');
		$.ajax({
            type: 'POST',
            url: 'common/check_name.php',
            data:{
                check_name:name
            },
                dataType: 'json',
        })
	    //$.post('./test.php', {word1:word_val1,word2:word_val2})
	    .done(function(data, status, jqXHR){
	        $("#result").html(data);
	        console.log(data);
	        if ( data ) {
	        	localStorage.setItem("name_w",name);
	        	window.location.href = "name_conf.html";
	        } else {
	        	window.location.href = "name_no.html";
	        }
	        //$("#ajax_result").html(data.word1 +"と"+ data.word2);//PHPからJSON形式で返ってくる場合
	    })
	    .fail(function(jqXHR, status, error){
	       $("#result").html("エラーです");
	   })
	    .always(function(jqXHR, status){
	        $("#log").html(status);
	    });
	}
});

// 名前確認
$('.name-conf-no').click(function(){
	window.location.href = "name_input.html";
});

$('.name-conf-ok').click(function() {
	var member_name = localStorage.getItem("name_w");
	$.ajax({
        type: 'POST',
        url: 'common/member_insert.php',
        data:{
            insert_member:member_name
        }
    })
    .done(function(data, status, jqXHR){
        $("#result").html(data);
        var new_local_stamp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//23
		var new_local_takara = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//15
		localStorage.setItem("local_stamp" , JSON.stringify(new_local_stamp) );
		localStorage.setItem("local_takara" , JSON.stringify(new_local_stamp) );
		localStorage.setItem("stamp_count" , 0);
		localStorage.setItem("takara_count" , 0);
        localStorage.setItem("name",member_name);
        localStorage.setItem("chu_other",0);
        window.location.href = "challenge.html";
    })
    .fail(function(jqXHR, status, error){
       $("#result").html("エラーです");
    })
    .always(function(jqXHR, status){
        $("#log").html(status);
    });
});

// 挑戦状
$('.challenge-ok').click(function(){
	window.location.href = "map.html";
});