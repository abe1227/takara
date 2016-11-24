// $(window).on('touchmove.noScroll', function(e) {
//     e.preventDefault();
// });

var timer;
var gmap = new GMaps({
	div: '#map',
	lat: 37.398034,
	lng: 140.388165,
	zoom: 17
});
var player = gmap.addMarker({
	lat: 37.398034,
	lng: 140.388165,
	title: 'player',
	icon: 'image/pointer.gif',
	optimized: false
});
var optionObj = {
	"enableHighAccuracy": false,
	"timeout": 1000000,
	"maximumAge": 100,
};
var watchPos;
var player_center = true;
var stamp_marker = [];
var takara_marker = [];

var stamp_data; //image_url,lat,lng,name,stamp_id
var takara_data; //answer,lat,lng,max_quantity,quantity_count,treasure_id

var local_stamp; //0:とってない 1:とった
var local_takara; //0:あけてない 1:あけた 2:カギまちがえた 3:たからばこない 4:カギ暗号おっけー
var stamp_count = 0;
var stamp_total = 20;
var takara_count = 0;
var takara_total = 15;
var stamp_chu = 5;
var chu_count = 0;
var chu_other = 0;
var new_local_stamp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//23
var new_local_takara = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//15

var s_index;
var t_index;

var stamp_get_index;

var key_a = 0;
var key_b = 0;
var key_c = 0;
var answer = 123;

/////////////////関数//////////////////////////////////

//モーダル表示
function modal_open(class_name){
	$('.' + class_name).slideDown('nomal');
}

//モーダル非表示
function modal_close(class_name){
	$('.' + class_name).slideUp('fast');
}

//スタンプ、宝箱一覧切り替え
function head_fade(f1,f2,f3,f4,f5,f6){
	$('.' + f1).fadeOut('fast', function() {});
	$('.' + f2).fadeOut('fast', function() {
		$('.' + f3).fadeIn('fast', function() {});
		$('.' + f4).fadeIn('fast', function() {});
		$('.' + f5).css('color','#40210f');
		$('.' + f6).css('color','rgba(64,33,15,0.5)');
	});
}

//宝箱結果、書き換え表示
function takara_result(img,img2,text2){
	$('.takara-result-img').attr('src',img);
	$('.takara-result-img2-td > img').attr('src',img2);
	$('.takara-result-text2').html(text2);
	$('.modal-takara-result').slideDown('nomal');
}

//スタンプ詳細、書き換え表示
function stamp_detail(name,flg,index,detail){
	$('.stamp-detail-name').text(name);
	$('.stamp-detail-shop > p').html(detail);
	index = index + 1;
	if ( flg ) {
		$('.stamp-detail-img').attr('src', 'image/stamp_back' + index + '_get.png');
		$('.stamp-detail-remarks-td > img').show();
		$('.stamp-detail-remarks-td > p').hide();
	} else {
		$('.stamp-detail-img').attr("src","image/stamp_back" + index + ".png");
		$('.stamp-detail-remarks-td > img').hide();
		$('.stamp-detail-remarks-td > p').show();
	}
	$('.modal-stamp-detail').slideDown('nomal');
}

//スタンプ、宝箱カウント、抽選券カウント true:stamp false:takara
function st_count(flg,num){
	if (flg) {
		stamp_count = stamp_count + num;
		$('.stamp-count').text(stamp_count + '/' + stamp_total);
		chu_count = Math.floor(stamp_count / stamp_chu + takara_count + chu_other);
		localStorage.setItem("stamp_count",stamp_count);
	} else{
		takara_count = takara_count + num;
		$('.takara-count').text(takara_count + '/' + takara_total);
		chu_count = chu_count + num;
		localStorage.setItem("takara_count",takara_count);
	}
	$('.chu-text').text('× ' + chu_count);
}

function chu_other_count(num){
	chu_other = chu_other + num;
	chu_count = chu_count + num;
	localStorage.setItem("chu_other",chu_other);
	$('.chu-text').text('× ' + chu_count);
}

//配列にflg格納
function local_set(flg,number){

}

//たからばこ詳細判定
function takara_flg(index){
	t_index = index;
	switch(local_takara[index]) {
		case 0: //あけてない
		treasure_id = index + 1;
		$.ajax({
			type: "POST",
			async: false,
			url: "common/treasure_count_check.php",
			data:{
				treasure_id:treasure_id
			},
			dataType: "json",
		            /**
		             * Ajax通信が成功した場合に呼び出されるメソッド
		             */
		             success: function(data, dataType)
		             {
		                //結果が0件の場合
		                if(data == null) alert('データが0件でした');
		                //返ってきたデータの表示
		                var $content = $('#result');
		                $content.append(data+"");
		                if ( data ) {
		                	modal_open('modal-takara-detail');
		                } else {
		                	local_takara[index] = 3;
		                	localStorage.setItem("local_takara",JSON.stringify(local_takara));
		                	takara_result('image/takara.png','image/takara_no_get.png','たからがなくなっちゃった…<br><br>他のたからばこも<br>探してみよう');
		                }
		            },

		            /**
		             * Ajax通信が失敗場合に呼び出されるメソッド
		             */
		             error: function(XMLHttpRequest, textStatus, errorThrown)
		             {
		                //エラーメッセージの表示
		                alert('Error : ' + errorThrown);
		            }
		        });
		break;
		case 1: //あけた
		takara_result('image/takara_open.png','image/takara_get.png','抽選券を<br>1枚GETしたよ！');
		break;
		case 2: //カギまちがえた
		takara_result('image/takara.png','image/takara_no_get.png','カギがまちがってた…<br><br>他のたからばこも<br>探してみよう')
		break;
	    case 3: //たからない
	    takara_result('image/takara.png','image/takara_no_get.png','たからがなくなっちゃった…<br><br>他のたからばこも<br>探してみよう')
	    break;
	    default :
	    break;
	};
}


///////////////////読み込み時////////////////////////////////

$(document).ready(function(){
	var name = localStorage.getItem("name");
	if (name == null) {
		window.location.href = "index.html";
	}

	local_stamp = localStorage.getItem("local_stamp");
	local_takara = localStorage.getItem("local_takara");
	if ( local_stamp == null ) {
		localStorage.setItem("local_stamp" , JSON.stringify(new_local_stamp) );
		localStorage.setItem("local_takara" , JSON.stringify(new_local_takara) );
	};
	if ( localStorage.getItem("stamp_count") == null ) {
		localStorage.setItem("stamp_count",stamp_count);
		localStorage.setItem("takara_count",takara_count);
		localStorage.setItem("chu_other",chu_other);
	}
	if ( localStorage.getItem("tuto_start") == null ) {
		localStorage.setItem("tuto_start",1);
	} else {
		$('.tuto-container').hide();
	}
	stamp_count = parseInt(localStorage.getItem("stamp_count"));
	takara_count = parseInt(localStorage.getItem("takara_count"));
	chu_other = parseInt(localStorage.getItem("chu_other"));
	st_count(true,0);
	st_count(false,0);
	chu_other_count(0);

	local_stamp = JSON.parse( local_stamp );
	local_takara = JSON.parse( local_takara );

	$.each(local_stamp,function(index, el) {
		var i = index + 1;
		if ( el == 1 ) {
			if (index >=20) {
				$('#s' + index + ' .sub-stamp-img').attr('src', 'image/stamp_back' + i + '_get.png');
			} else {
				$('#s' + index + ' .main-stamp-img').attr('src', 'image/stamp_back' + i + '_get.png');
			}
		}
	});
	$.each(local_takara,function(index, el) {
		if ( el == 1 ) {
			$('#t' + index + ' .main-takara-img').attr('src', 'image/takara_open.png');
		}
	});

	$.ajax({
		type: "POST",
		async: false,
		url: "common/get_stamps.php",
		dataType: "json",
		success: function(data, dataType)		{
			if(data == null) alert('データが0件でした');
			stamp_data = data;
			console.log(stamp_data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert('Error : ' + errorThrown);
		}
	});
	$.ajax({
		type: "POST",
		async: false,
		url: "common/get_treasures.php",
		dataType: "json",
		success: function(data, dataType)
		{
			if(data == null) alert('データが0件でした');
			takara_data = data;
			console.log(takara_data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			alert('Error : ' + errorThrown);
		}
	});

	var url = location.href;
	if ( url != 'http://trehun.azurewebsites.net/takara/map.html' ) {
		var code = url.slice(-9);
		$.each(stamp_data,function(index, el) {
			if ( code == el.code ) {
				if (local_stamp[index] == 0) {
					stamp_get_index = index + 1;
					switch(index) {
						case 20: //テスト
							$('#s' + index + ' .sub-stamp-img').attr('src', 'image/stamp_back' + stamp_get_index + '_get.png');
							break;
						case 21: //wi-fi
							chu_other_count(1);
							$('#s' + index + ' .sub-stamp-img').attr('src', 'image/stamp_back' + stamp_get_index + '_get.png');
							break;
						case 22: //スパイ
							chu_other_count(1);
							$('#s' + index + ' .sub-stamp-img').attr('src', 'image/stamp_back' + stamp_get_index + '_get.png');
							break;
						default :
							st_count(true,1);
							$('#s' + index + ' .main-stamp-img').attr('src', 'image/stamp_back' + stamp_get_index + '_get.png');
							break;
					}
					$('.stamp-get-img > img').attr('src', 'image/stamp_back' + stamp_get_index + '.png');
					$('.modal-stamp-get').show();
					local_stamp[index] = 1;
					localStorage.setItem( "local_stamp" , JSON.stringify(local_stamp) );
				}
				stamp_detail(el.name,true,index,el.shop_detail);
				if (index >= 20) $('.stamp-detail-remarks-td > p').hide();
			}
		});
	}

	var count = 0;
	$.each(stamp_data, function(index, value){
		if (index < 20) {
			hukidasi = value.stamp_id;
		} else {
			hukidasi = value.name;
		}
		stamp_marker[count] = gmap.drawOverlay({
			lat: parseFloat(value.lat),
			lng: parseFloat(value.lng),
			layer: 'overlayLayer',
			content: '<div class="overlay">' + hukidasi + '<div class="overlay_arrow above"></div></div>',
			verticalAlign: 'top',
			horizontalAlign: 'center',
			click: function(){
				if (local_stamp[index] == 1) {
					stamp_detail(value.name,true,index,value.shop_detail);
				} else {
					stamp_detail(value.name,false,index,value.shop_detail);
				}
				if (index >= 20) {
					$('.stamp-detail-remarks-td > p').hide();
				}
			}
		});
		count++;
	});

	var count = 0;
	$.each(takara_data, function(index, value){
		i = index + 1;
		takara_marker[count] = gmap.addMarker({
			lat: parseFloat(value.lat),
			lng: parseFloat(value.lng),
			icon: 'image/takara' + i + '_marker.png',
			title: value.name,
			click: function(e) {
				takara_flg(index);
			}
		});
		count++;
	});

	if (navigator.geolocation) {
		watchPos = navigator.geolocation.watchPosition(setMapPosition, errorCallback, optionObj);
	} else {
		alert('あなたのブラウザは対応していません');
	}

});

/////////////////////////////////////////////////////////////////////////

$('.main-carousel').flickity({
	cellAlign: 'center',
	contain: true,
	percentPosition: true,
	// prevNextButtons: false,
	draggable: true
});

function setMapPosition(pos){
	var lat = pos.coords.latitude;
	var lng = pos.coords.longitude;

	player.setMap(null);

	player = gmap.addMarker({
		lat: lat,
		lng: lng,
		title: 'player',
		icon: 'image/pointer.gif',
		optimized: false
	});

	if (player_center) {
		gmap.setCenter(lat, lng);
		player_center = false;
	}
}

function errorCallback(error){
	var err_msg = "";
	switch(error.code)
	{
		case 1:
		err_msg = "位置情報の利用が許可されていません";
		break;
		case 2:
		err_msg = "デバイスの位置が判定できません";
		break;
		case 3:
		err_msg = "タイムアウトしました";
		break;
	}

	alert(err_msg);
}

$('.tuto-start').click(function() {
	$('.tuto-container').slideUp();
});

// $('.chu-tab').click(function(){
// 	localStorage.removeItem("local_stamp");
// 	localStorage.removeItem("local_takara");
// 	localStorage.removeItem("stamp_count");
// 	localStorage.removeItem("takara_count");
// 	alert("ページ更新してください");
// });

/////////モーダル表示///////////////////////////////
$(".stamp-list").click(function(){
	modal_open('modal-stamp');
});

$('.kokoroe').click(function(){
	modal_open('modal-kokoroe');
});

$('.gai').click(function(){
	modal_open('modal-gai');
});

/////////モーダル非表示/////////////////////////////
$('.close-stamp').click(function() {
	modal_close('modal-stamp');
});

$('.close-stamp-detail').click(function() {
	modal_close('modal-stamp-detail');
});

$('.close-takara-detail').click(function() {
	modal_close('modal-takara-detail');
});

$('.close-takara-result').click(function(){
	modal_close('modal-takara-result');
	modal_close('modal-takara-detail');
});

$('.close-kokoroe').click(function(){
	modal_close('modal-kokoroe');
});

$('.close-gai').click(function(){
	modal_close('modal-gai');
});
/////////////////////////////////////////////////


// スタンプ一覧スタンプタップ
$('.main-stamp-img').click(function() {
	s_index = $(this).parent().attr("id");
	s_index = parseInt(s_index.substr(1));
	if (local_stamp[s_index] == 1) {
		stamp_detail(stamp_data[s_index].name,true,s_index,stamp_data[s_index].shop_detail);
	} else {
		stamp_detail(stamp_data[s_index].name,false,s_index,stamp_data[s_index].shop_detail);
	}
});

$('.sub-stamp-img').click(function() {
	s_index = $(this).parent().attr("id");
	s_index = parseInt(s_index.substr(1));
	if (local_stamp[s_index] == 1) {
		stamp_detail(stamp_data[s_index].name,true,s_index,stamp_data[s_index].shop_detail);
	} else {
		stamp_detail(stamp_data[s_index].name,false,s_index,stamp_data[s_index].shop_detail);
	}
	$('.stamp-detail-remarks-td > p').hide();
});

// スタンプheadタップ
$('.stamp-head').click(function(){
	head_fade('border-takara','main-takara','border-stamp','main-stamp','stamp-head','takara-head');
});

// たからばこheadタップ
$('.takara-head').click(function(){
	head_fade('border-stamp','main-stamp','border-takara','main-takara','takara-head','stamp-head');
});

// スタンプGET
$('.stamp-get-img > img').click(function(){
	// stamp_get_indexで画像とれる
	$('.stamp-get-img > img').attr('src', 'image/stamp_back' + stamp_get_index + '_get.png');
	setTimeout(function(){
		modal_close('modal-stamp-get');
	},1000);
});

// たからばこ一覧たからばこタップ
$('.main-takara-img').click(function() {
	key_a = 0;
	key_b = 0;
	key_c = 0;
	answer = 123;
	$('.key-img#A').attr('src','image/key0.png');
	$('.key-img#B').attr('src','image/key0.png');
	$('.key-img#C').attr('src','image/key0.png');
	$('.takara-detail-open-td > p').html('');
	t_index = $(this).parent().attr("id");
	t_index = parseInt(t_index.substr(1));
	takara_flg(t_index);
});

$('.key-up-img').click(function(){
	var key_select = $(this).attr("id");
	switch(key_select) {
		case 'uA':
		key_a = (key_a + 1) % 10;
		$('.key-img#A').attr('src','image/key' + key_a + '.png');
		break;
		case 'uB':
		key_b = (key_b + 1) % 10;
		$('.key-img#B').attr('src','image/key' + key_b + '.png');
		break;
		case 'uC':
		key_c = (key_c + 1) % 10;
		$('.key-img#C').attr('src','image/key' + key_c + '.png');
		break;
	}
});
$('.key-down-img').click(function(){
	var key_select = $(this).attr("id");
	switch(key_select) {
		case 'dA':
		key_a = (key_a + 10 - 1) % 10;
		$('.key-img#A').attr('src','image/key' + key_a + '.png');
		break;
		case 'dB':
		key_b = (key_b + 10 - 1) % 10;
		$('.key-img#B').attr('src','image/key' + key_b + '.png');
		break;
		case 'dC':
		key_c = (key_c + 10 - 1) % 10;
		$('.key-img#C').attr('src','image/key' + key_c + '.png');
		break;
	}
});
$('.takara-detail-open-td > img').click(function(){
	console.log(takara_data[t_index].answer);
	key = key_a * 100 + key_b * 10 + key_c;
	if (takara_data[t_index].answer == key) {
		st_count(false,1);
		treasure_id = t_index + 1;
		$.ajax({
			type: "POST",
			url: "common/treasure_count_update.php",
			data:{
				treasure_id:treasure_id
			},
			dataType: "json",
			success: function(data, dataType)
			{
                //結果が0件の場合
                if(data == null) alert('データが0件でした');
            },

            /**
             * Ajax通信が失敗場合に呼び出されるメソッド
             */
             error: function(XMLHttpRequest, textStatus, errorThrown)
             {
                //エラーメッセージの表示
                alert('Error : ' + errorThrown);
            }
        });
		$('#t' + t_index + ' .main-takara-img').attr('src', 'image/takara_open.png');
		local_takara[t_index] = 1;
		localStorage.setItem("local_takara",JSON.stringify(local_takara));
		takara_result('image/takara_open.png','image/takara_get.png','抽選券を<br>一枚GETしたよ！');
	} else {
		$('.takara-detail-open-td > p').html('たからばこがあかない…<br>カギがまちがっているみたいだ');
	}
});

// 3択選択
// $('.key-img').click(function(){
// 	var key_select = $(this).attr("id");
// 	// console.log(key_select);
// 	if( takara_data[t_index].answer == key_select ){
// 		st_count(false,1);
// 		treasure_id = t_index + 1;
// 		$.ajax({
// 			type: "POST",
// 			url: "common/treasure_count_update.php",
// 			data:{
// 				treasure_id:treasure_id
// 			},
// 			dataType: "json",
// 			success: function(data, dataType)
// 			{
//                 //結果が0件の場合
//                 if(data == null) alert('データが0件でした');
//             },

//             /**
//              * Ajax通信が失敗場合に呼び出されるメソッド
//              */
//              error: function(XMLHttpRequest, textStatus, errorThrown)
//              {
//                 //エラーメッセージの表示
//                 alert('Error : ' + errorThrown);
//             }
//         });
// 		$('#t' + t_index + ' .main-takara-img').attr('src', 'image/takara_open.png');
// 		local_takara[t_index] = 1;
// 		localStorage.setItem("local_takara",JSON.stringify(local_takara));
// 		takara_result('image/takara_open.png','image/takara_get.png','抽選券を<br>一枚GETしたよ！');
// 	} else {
// 		local_takara[t_index] = 2;
// 		localStorage.setItem("local_takara",JSON.stringify(local_takara));
// 		takara_result('image/takara.png','image/takara_no_get.png','カギがまちがってた…<br><br>他のたからばこも<br>探してみよう');
// 	}
// });