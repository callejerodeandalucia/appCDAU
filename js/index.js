var iframeMapa;
var app = {
		initialize: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener("deviceready", this.onDeviceReady, true);
		},
		onDeviceReady: function() {

			iframeMapa = document.createElement('iframe');

			iframeMapa.id="imapa";
			iframeMapa.scrolling='no';
			document.getElementById('divMapa').appendChild(iframeMapa);
			iframeMapa.onload=function(){
				navigator.splashscreen.hide();
			};
			if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setMap, setMapNoLocation, {maximumAge: 15000, timeout: 5000, enableHighAccuracy:true});
			}
			else {
				setMap()
			}
		}
};
function setMap(pos) {
	if (pos) {
		var prj25830 ="+proj=utm+zone=30+ellps=GRS80+units=m+no_defs";
		pos = proj4(prj25830,[pos.coords.longitude,pos.coords.latitude]);
	}
	iframeMapa.src = configMap() + "&zoom=10&center="+pos[0]+","+pos[1];
}

function setMapNoLocation(error) {
	iframeMapa.src = configMap();
}
var patchCodeMapea = `function(mapajs){
		window.goToFormulario = function(xmin,xmax,ymin,ymax) {
			var coordenadas='goToFormulario,'.concat(xmin).concat(',').concat(xmax).concat(',').concat(ymin).concat(',').concat(ymax);
			parent.postMessage(coordenadas, '*');
		};
		window.addEventListener('message', function(event) {
			if (event.data === 'patch_cdau'){
				mapajs.on(M.evt.COMPLETED,function(evt){
				var geosearchCtrl = mapajs.getControls("geosearch")[0];
					geosearchCtrl.on(M.evt.COMPLETED,function(evt){
					var htmlGeosearch=geosearchCtrl.resultsContainer_.innerHTML;

					if(htmlGeosearch.includes("partial")) {
						var bbox=mapajs.getBbox();
						xmin=bbox.x.min;
						xmax=bbox.x.max;
						ymin=bbox.y.min;
						ymax=bbox.y.max;
geosearchCtrl.resultsContainer_.innerHTML='<div class=results id=m-geosearch-results-scroll></div><div class=results><div class=partial>No se han encontrado resultados para la búsqueda.</div><button id=formularioButton onclick="goToFormulario(xmin,xmax,ymin,ymax);"
style=background-color:green;border-radius:42px;display:inline-block;cursor:pointer;color:black;font-family:Arial;font-size:15px;font-weight:bold;padding:5px;text-decoration:none;text-align:center;margin-left:20px;margin-top:10px;border:1px;>Dar alta</button></div><div class=page><span class=found id=m-geosearch-page-found>0</span> de <span class=total>0</span><div class=g-cartografia-flecha-arriba></div></div>';
					}
				});
		});
	}
				parent.postMessage('ready', '*');
				});
			}`;
function configMap(){
	var src = urlMapea + "?controls=location";
	if (contextos!=""){src += "&" + contextos;}
	if (layers!=""){src += "&layers=" + layers;}
	if (urlGeosearch!=""){src += "&geosearch=" + urlGeosearch;}
	if (extra!=""){src += "&" + extra;}
	src+="&callback=("+ patchCodeMapea + ")";
	return src;
}

window.addEventListener('message', function(event) {
	if (event.data === 'ready') {
		event.source.postMessage('patch_cdau', '*');
	}
        else if (event.data.includes('goToFormulario')) {
					var coordenadasArray=event.data.split(",");
					var coordenadas=coordenadasArray[1]+","+coordenadasArray[2]+","+coordenadasArray[3]+","+coordenadasArray[4];
               window.location.href = 'formulario.html?coord='+coordenadas;
        }
}, false);

app.initialize();
