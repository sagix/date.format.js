/**
 * date.format.js
 * version : 1.0
 * authors : Nicolas Mouchel (aka sagix)
 * license : MIT
 */
(function(){

var i18n = {};

Date.formatter = {
	language : navigator.language ? navigator.language : navigator.userLanguage.slice(0,2),
	lang: function (l, d){
		i18n[l] = d;
	}
};

var patterns = {
	'G':function(date, padding){return "unimplemented"},//Era
	'y':function(date, padding){return pad(date.getUTCFullYear(), padding)},
	'yy':function(date){return (''+date.getUTCFullYear()).slice(-2)},
	'M':function(date, padding){return padding >= 4 ? i18n[Date.formatter.language].months[date.getUTCMonth()] : padding == 3 ? i18n[Date.formatter.language].monthsShort[date.getUTCMonth()] : pad(date.getUTCMonth()+1,padding)},
	'w':function(date, padding){
		var onejan = new Date(date.getUTCFullYear(),0,1);
		return Math.ceil((((date - onejan) / 86400000) + onejan.getUTCDay()+1)/7);},//Week in year
	'W':function(date, padding){return "unimplemented"},//Week in month
	'D':function(date, padding){return Math.ceil((date - new Date(date.getUTCFullYear(),0,1)) / 86400000);},//Day in year
	'd':function(date, padding){return pad(date.getUTCDate(),padding)},
	'F':function(date, padding){return "unimplemented"},//Day of week in month
	'E':function(date, padding){return padding >= 4 ? i18n[Date.formatter.language].weekdays[date.getUTCDay()] : i18n[Date.formatter.language].weekdaysShort[date.getUTCDay()]},
	'u':function(date, padding){return date.getDay()},//Day number of week
	'a':function(date){return date.getUTCHours()<12 ? 'AM' : 'PM'},
	'H':function(date, padding){return pad(date.getUTCHours(), padding)},
	'k':function(date, padding){return pad(date.getUTCHours()+1, padding)},
	'K':function(date, padding){return pad(date.getUTCHours()%12, padding)},	
	'h':function(date, padding){return pad((date.getUTCHours()+11)%12+1, padding)},
	'm':function(date, padding){return pad(date.getUTCMinutes(), padding)},
	's':function(date, padding){return pad(date.getUTCSeconds(), padding)},
	'S':function(date, padding){return pad(date.getUTCMilliseconds(), padding)},
	'z':function(date, padding){return "unimplemented"},//General time zone
	'Z':function(date, padding){return "unimplemented"},//RFC 822 time zone
	'X':function(date, padding){return "unimplemented"},//ISO 8601 time zone
};
patterns['YY'] = patterns['yy'];
patterns['Y'] = patterns['y'];

function pad(str, length){
			str = '' + str;
			while (str.length < length){
				str = '0' + str;
			}
			return str
		};
function wrap(fn, context, param) {
			return function(date) {
					return fn.call(context, date, param);
			};
		}

var firstLetterPattern = (function(){
	var buffer = '';
	for(var name in patterns){
		buffer+=name[0];
	}
	return buffer;
})();

Date.prototype.format = function(pattern){
	var buffer = '';
	for(var i = 0 ; i < pattern.length ; i++){
		if(firstLetterPattern.indexOf(pattern[i]) !== -1){
			var letter = pattern[i];
			var mPattern = '';
			for( nb = 0; pattern[i] == letter ; nb++, i++){
				mPattern+=pattern[i];
			}
			i--;
			if(patterns[mPattern]){
				buffer+=patterns[mPattern](this);
			}else{
				buffer+=patterns[mPattern[0]](this, mPattern.length);
			}
			
		}else if(pattern[i] === "'"){
			i++;
			if(pattern[i] === "'"){
				buffer+=pattern[i];
			}else{			
				do{
					if(pattern[i] === "'" ){
						if(pattern[i+1] !== "'"){
							break;
						}else{
							i++;
						}
					}
					buffer+=pattern[i];
					i++;					
				}while(true);
			}
		}else{
			buffer+=pattern[i];
		}
	}
	return buffer;
}

window.DateFormatter = function (pattern){
	this.methods = [];
	for(var i = 0 ; i < pattern.length ; i++){
		if(firstLetterPattern.indexOf(pattern[i]) !== -1){
			var letter = pattern[i];
			var mPattern = '';
			for( nb = 0; pattern[i] == letter ; nb++, i++){
				mPattern+=pattern[i];
			}
			i--;
			if(patterns[mPattern]){
				this.methods.push(wrap(patterns[mPattern], this, null));
			}else{
				this.methods.push(wrap(patterns[mPattern[0]], this, mPattern.length));
			}
			
		}else if(pattern[i] === "'"){
			var buffer = ''
			i++;
			if(pattern[i] === "'"){
				buffer+=pattern[i];
			}else{			
				do{
					if(pattern[i] === "'" ){
						if(pattern[i+1] !== "'"){
							break;
						}else{
							i++;
						}
					}
					buffer+=pattern[i];
					i++;					
				}while(i < pattern.length);
			}
			this.methods.push(buffer);
		}else{
			this.methods.push(pattern[i]);
		}
	}
}

DateFormatter.prototype.format = function(date) {
	var buffer = '';
	for(var i = 0 ; i < this.methods.length ; i++){
		if(typeof this.methods[i] === 'function'){
			buffer+=this.methods[i](date);
		}else{
			buffer+=this.methods[i];
		}
	}
	return buffer
};
}).call(this);

Date.formatter.lang('en', {
	months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
});

Date.formatter.lang('fr', {
	months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
	monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
});
