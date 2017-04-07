$( document ).ready(function() {
fillTiposPortal();

var url=window.location.href;
var urlArray=url.split("coord=");
if(urlArray.length>1){
var coordenadas=urlArray[1].split(",");
$("#coordX").val(coordenadas[0]+"|"+coordenadas[1]);
$("#coordY").val(coordenadas[2]+"|"+coordenadas[3]);
}
$("#altaIncidencias").validate({
errorClass:'field-validation-error',
	messages: {
   	tituloNota:"Especifica un título",
		tipoinciformulario: "Debe de seleccionar el motivo de apertura",
		municipioNota:"Especifique un municipio",
		tipoVia:"Especifique un tipo de via",
		nombreVia:"Especifique un nombre para la via",
		tipoPortal:"Especifique un tipo de portal",
		numPortal:"Especifique un numero de portal",
		descripcion:"Especifique una descripción",
		coordX:"Especifique las coordenadas X",
		coordY:"Especifique las coordenadas Y"
	},
})
});
function disablePortal() {
	var textSelect = $("#tipoinciformulario option:selected").text();
	if(textSelect.includes(" vía")){
		$('#requiredNPortal').fadeOut();
		alterElement('#numPortal', true);
		alterElement('#numPortal-error', true);
		alterElement('#tipoPortalTr', true);
		alterElement('#letraPortal', true);
		alterElement('#bloquePortal', true);
		alterElement('#portal', true);
	}else{
		$('#requiredNPortal').fadeIn();
		alterElement('#tipoPortalTr', false);
		alterElement('#numPortal', false);
		alterElement('#numPortal-error', false);
		alterElement('#letraPortal', false);
		alterElement('#bloquePortal', false);
		alterElement('#portal', false);
	}
}


/**
 * Limpia el formulario
 */
function clearForm(){
	$('#tituloNota').val("");
	$('#tipoinciformulario').val("");
	$('#municipioNota').val("");
	$('#nombreVia').val("");
	$('#tipoPortal').val("");
	$('#numPortal').val("");
	$('#letraPortal').val("");
	$('#bloquePortal').val("");
	$('#portal').val("");
	$('#coordY').val("");
	$('#coordX').val("");
	function changeMotivoApertura() {
		disablePortal();
		disableNomViaAlta();
	}
	$('#descripcion').val("");
	$('#strKaptcha').val("");
	$('#tipoVia').val("");
	$('#idVia').val("");
}
function disableNomViaAlta() {
	var textSelect = $("#tipoinciformulario option:selected").text();
	if ((textSelect.includes("Baja")
			|| textSelect.includes("Modificación")
			|| (textSelect.includes("Alta")) && textSelect.includes("portal"))) {
		if ($('#errores') != null && $('#errores').length == 0) {
			$('#nombreVia').val("");
			$('#idVia').val("");
		}
	}

}
function changeMotivoApertura() {
	disablePortal();
	disableNomViaAlta();
}
function alterElement(element, disable){
	var label = $(element).is('input[type!="button"]')?$(element).parent().parent().children('td').first().children('b'):"";

	if(disable){
		$(element).fadeOut();
		$(element).prop('disabled', true);
		$(label).fadeOut();
	}else{
		$(element).fadeIn();
		$(element).prop('disabled', false);
		$(label).fadeIn();
	}
}

function fillMunicipios(idProvincia) {
	url=urlServidor+"/wscdau/services/InterfazCDAUWS";
	var xmlhttp = new XMLHttpRequest();
				var sr = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><obtenerMunicipios xmlns=\"'+url+'\"><codProv>'+idProvincia+'</codProv></obtenerMunicipios></soap:Body></soap:Envelope>';
				xmlhttp.open('POST', url, true);

    xmlhttp.onreadystatechange = function() {
			var nombresMunicipio;
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
								var municipiosXMLSoap=xmlhttp.responseText;
								var municipiosXML=municipiosXMLSoap.split("<multiRef");
								for(var i=1;i<municipiosXML.length;i++){
									if(municipiosXML[i].includes("id"))
									var municipioIdXML=municipiosXML[i].split("</idMunicipio>");
									var nombreMunicipioXML=municipiosXML[i].split("</nombreMunicipio>");
									var municipioId=municipioIdXML[0].split("\"xsd:string\"\>");
									var nombreMunicipioXML=nombreMunicipioXML[0].split("<nombreMunicipio");
									var nombreMunicipio=nombreMunicipioXML[1].split("\"xsd:string\"\>");
									if(municipioId != null || nombreMunicipio != null){
										$('#municipioNota').append($("<option></option>").attr("id",municipioId[1]).text(nombreMunicipio[1]));
						}
					}
      	}
			}
  	}
		xmlhttp.setRequestHeader("SOAPAction", url);
		xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		xmlhttp.send(sr);
	}
function fillTiposPortal(){
		$('#tipoVia')
		.find('option')
		.remove()
		.end()
		.append('<option value="">--Selecciona un tipo de via--</option>')
		.val('');
		var xmlhttp = new XMLHttpRequest();

 url=urlServidor+"/wscdau/services/InterfazCDAUWS";
xmlhttp.open('POST',url, true);
		var sr = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><obtenerTiposVia xmlns=\"'+url+'\"></obtenerTiposVia></soap:Body></soap:Envelope>';

		xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {
								var tiposViaXMLSoap=xmlhttp.responseText;
								var tiposViaXML=tiposViaXMLSoap.split("<multiRef");
								for(var i=1;i<tiposViaXML.length;i++){
									var tiposViaLines=tiposViaXML[i].split("\"xsd:string\">");
									tiposViaXMLSplit=tiposViaLines[1].split("</nombre>");
									var tipoVia=tiposViaXMLSplit[0];
									$('.tipoVia').append($('<option></option>').attr("id",tipoVia).text(tipoVia));
								}
						}
				}
		}

		xmlhttp.setRequestHeader("SOAPAction",url);
		xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		xmlhttp.send(sr);
}

function enviaAltaIncidencia(){

var motivoApertura=$('#tipoinciformulario').val();

var municipioNota=$('#municipioNota option:selected').text();
var municipioINE=$('#municipioNota option:selected').attr('id');
var tipoVia=$('#tipoVia option:selected').text();
var nombreVia=$('#nombreVia').val();
var tipoPortal=$('#tipoPortal option:selected').val();
var numPortal=$('#numPortal').val();
var descripcion=$('#descripcion').val();
var coordX=$('#coordX').val();
var coordY=$('#coordY').val();
if(motivoApertura==1){
	var json="{motivoApertura:"+motivoApertura+","+
	         "ineMun:"+municipioINE+","+
	         "tipoVia:"+tipoVia+","+
	         "nombreVia:"+nombreVia+","+
	         "descripcion:"+descripcion+","+
	         "coordX:"+coordX+","+
	         "coordY:"+coordY+
	         "}";
}else{
var json="{motivoApertura:"+motivoApertura+","+
         "ineMun:"+municipioINE+","+
         "tipoVia:"+tipoVia+","+
         "nombreVia:"+nombreVia+","+
         "tipoPortalPK:"+tipoPortal+","+
         "numPortalPK:"+numPortal+","+
         "descripcion:"+descripcion+","+
         "coordX:"+coordX+","+
         "coordY:"+coordY+
         "}";
}
url=urlServidor+"/cdau_adm/services/InterfazIncidenciaCDAU";

	var sr ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ws=\"http://ws.cdau.guadaltel.es\">"+
   "<soapenv:Header/>\n"+
   "<soapenv:Body>\n"+
      "<ws:nuevaIncidenciaAppMovil>\n"+
         "<ws:json>"+json+"</ws:json>\n"+
      "</ws:nuevaIncidenciaAppMovil>\n"+
   "</soapenv:Body>\n"+
"</soapenv:Envelope>";
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('POST', url, true);
xmlhttp.setRequestHeader("SOAPAction", url+"/nuevaIncidenciaAppMovil");
xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
xmlhttp.send(sr);
alert("Se va a dar de alta la incidencia");
window.location.href=urlMapa+"/index.html";
}
