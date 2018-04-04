var XMLHttpRequest = require("/usr/local/lib/node_modules/xmlhttprequest").
XMLHttpRequest;
var btoa = require('/usr/local/lib/node_modules/btoa');

var TimerID;
var dnsurl;
var freq = 5;
var CurrentIP = '0.0.0.0';
var IPServer = 'http://freegeoip.net/json/';

function buildurl(){
	var u = 'bulbmaker';
	var p = '16026C96480B7574';
	var h = 'home.ferryfair.com';
	var w = 'NO';

	dnsurl = 'http://' +
	'@dynamic.zoneedit.com/dyn/jsclient.php?rsp_ident=zoneedit' +
	'&hostname=' + escape(h) + '&wildcard=' + escape(w) ;

	var xhr = new XMLHttpRequest();
   xhr.open('GET', IPServer, false);
   console.log('Echoing current IP from ' + IPServer);
   xhr.send(null)
   if (xhr.status === 200) {
      var Response = JSON.parse(xhr.responseText);
      console.log(Response);
      if (CurrentIP === Response.ip) {
         console.log('IP unchanged');
         delete xhr;
         return false;
      } else {
         console.log('Current IP is ' + Response.ip);
         CurrentIP = Response.ip;
      }
   } else {
      console.log('Status : ' + xhr.status);
      console.error('Failed to query current IP');
      return false;
   } 
   delete xhr;

   xhr = new XMLHttpRequest();
   console.log('Updating IP to ' + dnsurl);
	xhr.open('GET', dnsurl, false)
   xhr.setRequestHeader("Authorization", "Basic " + btoa(u + ":" + p))
   xhr.send(null)
   if (xhr.readyState === 4) {
      console.log('Update query status: ' + xhr.status)
      console.log(xhr.responseText)
      delete xhr;
      return true;
   }
   delete xhr;
   return false;
}

function startClient() {
	var d = new Date();

	if (buildurl()) {
		if (freq != 0) {
			TimerID = setTimeout(startClient, freq*1000*60);
		} else {
			TimerID = setTimeout(stopClient, 5000 );
		}
	}
}

function stopClient(clear) {
	clearTimeout(TimerID);
	console.log('OFF');
}

startClient();
