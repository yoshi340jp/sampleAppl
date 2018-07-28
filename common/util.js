var util = require('util');
var message_ja = require(process.cwd() + '/locales/message_ja.json');
var message_en = require(process.cwd() + '/locales/message_en.json');
var view_ja    = require(process.cwd() + '/locales/ja.json');
var view_en    = require(process.cwd() + '/locales/en.json');
var locale = 'ja'; //Default locale はJA
/**
 * メッセージの取得
 * @param {string} category カテゴリ名
 * @param {string} id ID
 * @param {Array} args 引数の配列
 */
function getMessage(locale,category, id, args) {
	var message;
	if(locale === 'ja'){
		message = message_ja;
	}else if(locale === 'en'){
		message = message_en;
	}

	var msg = message.message[category];
	if (msg) {
		if (msg[id]) {
			var param = [msg[id]];
			param = param.concat(args);
			return util.format.apply(this, param);
		}
	}
	return util.format('category:%s id:%s args:%s' ,category, id, args);
}

/**
 * エラーメッセージの取得
 * @param {string} id ID
 * @param {Array} args 引数の配列
 */
exports.getErrorMessage = function(id,args){
	return getMessage(this.locale,'error',id,args);
};

exports.setLocale = function(locale){
	this.locale = locale;
};

/**
 * 
 */
exports.getViewName = function(pageId, field){
	var view;
	if(this.locale === 'ja'){
		view = view_ja;
	}else if(this.locale === 'en'){
		view = view_en;
	}

	var page = view[pageId];
	if (page) {
		var fieldName = page[field];
		if(fieldName){
			return fieldName;
		}else{
			return '';
		}
	 } else {
		return '';
	 }
};

/**
 *isYYMMDD
 */
exports.isYYYYMMDD = function (str) {
  //null or 8文字でない or 数値でない場合はfalse
  if(str===null || str.length !== 8 || isNaN(str)){
    return false;
  }
 
  //年,月,日を取得する
  var y = parseInt(str.substr(0,4));
  var m = parseInt(str.substr(4,2)) -1;  //月は0～11で指定するため-1しています。
  var d = parseInt(str.substr(6,2));
  var dt = new Date(y, m, d);
 
  //判定する
  return (y === dt.getFullYear() && m === dt.getMonth() && d === dt.getDate());
};

/**
 *getNowYMD
 */
exports.getNowYMD = function(){
	  var dt = new Date();
	  var y = dt.getFullYear();
	  var m = ('00' + (dt.getMonth()+1)).slice(-2);
	  var d = ('00' + dt.getDate()).slice(-2);
	  var result = y +  m + d;
	  return result;
};

