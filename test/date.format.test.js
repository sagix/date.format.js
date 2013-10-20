var datasource=	[
	{time:1000, pattern:'Z', expected:''},
	{time:1000, pattern:'z', expected:''},
	{time:1000, pattern:'s', expected:'1'},
	{time:1000, pattern:'ss', expected:'01'},
	{time:13*1000, pattern:'ss', expected:'13'},
	{time:13*1000, pattern:'ssss', expected:'0013'},
	{time:0, pattern:'m', expected:'0'},
	{time:2*60000, pattern:'mm', expected:'02'},
	{time:12*60000, pattern:'mm', expected:'12'},
	{time:11*3600000, pattern:'H', expected:'11'},
	{time:23*3600000, pattern:'H', expected:'23'},
	{time:24*3600000, pattern:'H', expected:'0'},
	{time:12*3600000, pattern:'k', expected:'13'},
	{time:0, pattern:'h', expected:'12'},
	{time:12*3600000, pattern:'h', expected:'12'},
	{time:24*3600000, pattern:'h', expected:'12'},
	{time:25*3600000, pattern:'h', expected:'1'},
	{time:12*3600000, pattern:'K', expected:'0'},
	{time:0, pattern:'a', expected:'AM'},
	{time:0, pattern:'aaa', expected:'AM'},
	{time:13*3600000, pattern:'a', expected:'PM'},
	{time:0, pattern:'u', expected:4},
	{time:0, pattern:'E', expected:'jeu.'},
	{time:0, pattern:'EE', expected:'jeu.'},
	{time:0, pattern:'EEE', expected:'jeu.'},
	{time:0, pattern:'EEEE', expected:'jeudi'},
	{time:0, pattern:'EEEEE', expected:'jeudi'},
	{time:0, pattern:'D', expected:'1'},
	{time:994248536000, pattern:'D', expected:'185'},
	{time:-994248536000, pattern:'D', expected:'181'},	
	{time:0, pattern:'d', expected:'1'},
	{time:0, pattern:'dd', expected:'01'},
	{time:12*24*3600000, pattern:'dd', expected:'13'},
	{time:0, pattern:'ww', expected:'1'},
	{time:994248536000, pattern:'ww', expected:'27'},
	{time:0, pattern:'M', expected:'1'},
	{time:0, pattern:'MM', expected:'01'},
	{time:0, pattern:'yy', expected:'70'},
	{time:0, pattern:'yyyy', expected:'1970'},
	{time:0, pattern:'G', expected:''},
	{time:13*3600000 + 10*60000 + 2000, pattern:'h:m:s', expected:'1:10:2'},
	{time:13*3600000, pattern:'H:mm:ss', expected:'13:00:00'},
	{time:0, pattern:'EEEE dd MM yyyy', expected:'jeudi 01 01 1970'},
	{time:994248536000, pattern:"yyyy.MM.dd 'at' HH:mm:ss", expected:'2001.07.04 at 12:08:56'},
	{time:994248536000, pattern:"EEE, MMM d, ''yy", expected:"mer., juil. 4, '01"},
	{time:994248536000, pattern:"h:mm a", expected:'12:08 PM'},
	{time:994248536000, pattern:"hh 'o''clock' a", expected:"12 o'clock PM"},
	{time:994248536000, pattern:"K:mm a", expected:'0:08 PM'},
	{time:994248536000, pattern:"yyyyy.MMMMM.dd hh:mm aaa", expected:'02001.juillet.04 12:08 PM'},
	{time:994248536000, pattern:"EEE, d MMM yyyy HH:mm:ss", expected:'mer., 4 juil. 2001 12:08:56'},
	{time:994248536000, pattern:"yyMMddHHmmss", expected:'010704120856'},
	{time:994248536000, pattern:"YYYY-'W'ww-u", expected:'2001-W27-3'},
	{time:0, pattern:"''H'azer'm''e''ee''s''", expected:"'0azer0'e'ee'0'"},
]

function load(){
	var testSuite = document.getElementById('testSuite');
	for(var i = 0 ; i < datasource.length ; i++){
		var row = document.createElement('tr');
		var time = document.createElement('td');
		var pattern = document.createElement('td');
		var actual = document.createElement('td');
		var actualDF = document.createElement('td');
		var expected = document.createElement('td');
		
		time.innerHTML = datasource[i].time;
		pattern.innerHTML = datasource[i].pattern;
		actual.innerHTML = (new Date(datasource[i].time)).format(datasource[i].pattern);
		actualDF.innerHTML = (new DateFormatter(datasource[i].pattern)).format(new Date(datasource[i].time));
		expected.innerHTML = datasource[i].expected;
		
		if(actual.innerHTML != actualDF.innerHTML){
			row.className="orange";
		}else if(actual.innerHTML != expected.innerHTML){
			row.className="red";
		}else{
			row.className="green";
		}
		
		row.appendChild(time);
		row.appendChild(pattern);
		row.appendChild(actual);
		row.appendChild(actualDF);
		row.appendChild(expected);
		testSuite.appendChild(row);
	}
	benchmarkFormatDateChange();
	benchmarkDateFormatterDateChange();
	benchmarkFormatPatternChange();
	benchmarkDateFormatterPatternChange();
}

function benchmarkFormatDateChange(){
	var startTime = new Date().getTime();
	for(var i = 0 ; i < 50000 ; i++){
		var date = new Date(994248536000 + i);
		date.format("''yyyy'zob'MM'o''clock'ddHHmmss");
	}

	var endTime = new Date().getTime();
	var result = (endTime-startTime);
	console.debug(result);
}

function benchmarkDateFormatterDateChange(){
	var startTime = new Date().getTime();
	var dateFormatter = new DateFormatter("''yyyy'zob'MM'o''clock'ddHHmmss");
	for(var i = 0 ; i < 50000 ; i++){
		var date = new Date(994248536000 + i);
		dateFormatter.format(date);
	}

	var endTime = new Date().getTime();
	var result = (endTime-startTime);
	console.debug(result);
}

function benchmarkFormatPatternChange(){
	var startTime = new Date().getTime();
		var date = new Date(994248536000);
	
	for(var i = 0 ; i < 50000 ; i++){
		date.format("''yyyy'zob'MM'o''clock'"+"ddHHmmss".slice(0, 1 + i%6) );
	}

	var endTime = new Date().getTime();
	var result = (endTime-startTime);
	console.debug(result);
}

function benchmarkDateFormatterPatternChange(){
	var startTime = new Date().getTime();
	var date = new Date(994248536000	);
	for(var i = 0 ; i < 50000 ; i++){
	var dateFormatter = new DateFormatter("''yyyy'zob'MM'o''clock'" +"ddHHmmss".slice(0, 1 + i%6));
		dateFormatter.format(date);
	}

	var endTime = new Date().getTime();
	var result = (endTime-startTime);
	console.debug(result);
}

document.addEventListener( 'DOMContentLoaded', load, false );