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
	  var m = ("00" + (dt.getMonth()+1)).slice(-2);
	  var d = ("00" + dt.getDate()).slice(-2);
	  var result = y +  m + d;
	  return result;
};

