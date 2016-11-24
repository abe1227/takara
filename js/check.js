function space(text){
	if (text == "") {
		return true;
	} else {
		return false;
	}
}

function length(text , len){
	if (text.length > len) {
		return true;
	} else {
		return false;
	}
}

function text_check(text){
	if(text.match(/[^a-zA-Zａ-ｚＡ-Ｚぁ-ん]/)){
		return true;
	} else {
		return false;
	}
}