// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.14/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/context/GxeContext","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ./DocumentTypes ./Logger ../../../kernel".split(" "),function(d,f,e,g,h,k,l){d=d(null,{allowedTypeKeys:["arcgis"],allowView:!1,allowViewXml:!1,allowDownload:!1,allowDraft:!0,defaultArcGISStyle:"ISO 19139 Metadata Implementation Specification GML3.2",forceDefaultArcGISStyle:!0,arcgisGeocoder:null,geocoders:null,basemap:"streets",basemapUrl:null,showMapAttribution:!1,showMapLogo:!0,wrapAround180:!1,
gemetUrl:"http://www.eionet.europa.eu/gemet",gemetConceptThesaurus:"http://www.eionet.europa.eu/gemet/concept/",gemetInspireThemeThesaurus:"http://inspire.ec.europa.eu/theme/",documentTypes:null,logger:null,session:null,constructor:function(a){f.mixin(this,a);this.session={};this.documentTypes=new h;this.logger=new k({debugEnabled:!0})},filterDocumentTypes:function(){var a=[];e.forEach(this.documentTypes.list,function(b){e.some(this.allowedTypeKeys,function(c){if(b.key===c)return a.push(b),!0})},
this);return a},setAllowedTypeKeys:function(a){var b=[],c=[];"undefined"===typeof a||null===a||("string"===typeof a?b=a.split(","):a.push&&(b=a),e.forEach(this.documentTypes.list,function(a){e.some(b,function(b){if(a.key===f.trim(b))return c.push(a.key),!0})}),0<c.length&&(this.allowedTypeKeys=c))}});g("extend-esri")&&f.setObject("dijit.metadata.context.GxeContext",d,l);return d});