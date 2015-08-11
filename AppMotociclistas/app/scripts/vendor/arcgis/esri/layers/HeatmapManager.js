// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.14/esri/copyright.txt for details.
//>>built
define("esri/layers/HeatmapManager","dojo/_base/declare dojo/_base/lang dojo/aspect dojo/_base/array require ../kernel ../sniff ../geometry/Point ../geometry/webMercatorUtils ./MapImage ../renderers/HeatmapRenderer ../tasks/query dojo/_base/fx".split(" "),function(e,l,t,q,u,v,w,x,y,z,r,A,s){function B(){}function C(b){var a=b.layer;return{geometry:b.geometry,attributes:b.attributes,getLayer:function(){return a}}}e=e(null,{declaredClass:"esri.layers.HeatmapManager",heatmapRenderer:null,sourceLayer:null,
imageLayer:null,useTiles:!0,useWorker:!1,map:null,constructor:function(b){this.sourceLayer=b;this._hndls=[]},initialize:function(b){this.map=b;var a=this.sourceLayer,d=a.renderer;a.setDrawMode(!1);this.imageLayer=b._getMapImageLyr();var c=this;this.heatmapRenderer=d instanceof r?d:(d.getRendererInfoByZoom(b.getZoom())||d.getRendererInfoByScale(b.getScale())).renderer;this._setupDraw=this._setupDraw.bind(this);this.recalculateHeatmap=this.recalculateHeatmap.bind(this);this._removeRenderer=this._removeRenderer.bind(this);
this._handleRendererChange=this._handleRendererChange.bind(this);this._rendererChangeHandle=this.sourceLayer.on("renderer-change",this._handleRendererChange);this._handleOpacityChange=this._handleOpacityChange.bind(this);this._reprojectFeature=this._reprojectFeature.bind(this);u(["../workers/heatmapCalculator"],function(a){c._calculator=new a(l.mixin({width:c.map.width,height:c.map.height},c._getOptions()));c._setupRenderer();c.heatmapRenderer.getStats=a.calculateStats;c.heatmapRenderer.getHistogramData=
a.getHistogramData})},destroy:function(){this._removeHandlers();this._rendererChangeHandle&&this._rendererChangeHandle.remove();this._rendererChangeHandle=this.sourceLayer=this.imageLayer=this.map=this.heatmapRenderer=this._hndls=null},_handleRendererChange:function(b){var a=b.renderer,d=a instanceof r;this.heatmapRenderer?d?this.heatmapRenderer=a:this._removeRenderer(b):d&&(this.heatmapRenderer=a,this.sourceLayer&&this.map&&this._setupRenderer())},_handleOpacityChange:function(b){b=b.opacity;var a=
this._getImageBySourceId(this.sourceLayer.id);a&&a.setOpacity(b)},_setupRenderer:function(){var b=this._hndls,a=this.sourceLayer,d=this.map,c=this;a._originalDraw=a._draw;a._draw=B;a._div.clear();clearTimeout(this._resetTimer);this._resetTimer=setTimeout(this._resetGraphics.bind(this),250);b.push(a.on("update-end",this._setupDraw));b.push(a.on("suspend",function(a){(a=c._getImageBySourceId(c.sourceLayer.id))&&a.hide()}));b.push(a.on("resume",function(a){(a=c._getImageBySourceId(c.sourceLayer.id))&&
a.show()}));b.push(t.after(a,"redraw",this._setupDraw));b.push(d.on("layer-remove",function(b){b.layer==a&&((b=c._getImageBySourceId(c.sourceLayer.id))&&c.imageLayer.removeImage(b),c._removeRenderer({target:a}))}));a._collection&&b.push(a.on("graphic-add",function(a){c._reprojectFeature(a.graphic);c._setupDraw()}));1!==a.mode&&(b.push(d.on("resize, pan-end",this._setupDraw)),b.push(d.on("zoom-end",this._setupDraw)));b.push(a.on("opacity-change",this._handleOpacityChange));this.imageLayer.suspended&&
this.imageLayer.resume();a.graphics&&a.graphics.length&&(a.graphics[0].geometry&&!d.spatialReference.equals(a.graphics[0].geometry.spatialReference)&&q.forEach(a.graphics,function(a){this._reprojectFeature(a)}.bind(this)),this._setupDraw())},_setupDraw:function(){if(!this._drawTimer){var b=this;this._drawTimer=setTimeout(function(){clearTimeout(b._drawTimer);b._drawTimer=null;b.sourceLayer._getRenderer().isInstanceOf(r)&&b.recalculateHeatmap()},16)}},_removeRenderer:function(b){var a=b.target;a._draw=
a._originalDraw;delete a._originalDraw;a.setDrawMode(!0);this._removeHandlers();this._hndls=[];var d=this._getImageBySourceId(this.sourceLayer.id);d&&this.imageLayer.removeImage(d);clearTimeout(this._drawTimer);clearTimeout(this._resetTimer);this._drawTimer=this._resetTimer=null;a.renderer!=b.renderer&&a.renderer.getRendererInfo?this.heatmapRenderer=null:(a.redraw(),this.destroy())},recalculateHeatmap:function(){this._calculator?this._doMainCalculation():this._calculatorClient&&this._doWorkerCalculation()},
_reprojectFeature:function(b){if(b&&b.geometry){var a=b.geometry,d=this.map.spatialReference;d.equals(a.spatialReference)||(a=y.project(a,d),null==a?console.log("Unable to reproject features to map's spatial reference. Please convert feature geometry before adding to layer"):b.geometry=a)}},_doWorkerCalculation:function(){},_doMainCalculation:function(){var b=this.sourceLayer,a=this.map,d=this.heatmapRenderer,c=this.map.extent,p=this.map.width,e=this.map.height,g=this._calculator,h=this,m=function(f){f=
h._getScreenPoints(f.features,a,b);f=g.calculateImageData(l.mixin({screenPoints:f,mapinfo:{extent:[c.xmin,c.ymin,c.xmax,c.ymax],resolution:a.getResolution()},width:p,height:e},h._getOptions()));f=d.getSymbol(C({geometry:a.extent,attributes:{size:[p,e],imageData:f},layer:b}));f=new z({extent:a.extent,href:f.url,opacity:0,sourceId:b.id});h._swapMapImages(f,h._getImageBySourceId(b.id));b.suspended&&f.hide()},k={geometry:a.extent,timeExtent:b.useMapTime?a.timeExtent:void 0,spatialRelationship:A.SPATIAL_REL_INTERSECTS};
null!=b._canDoClientSideQuery(k)?b.queryFeatures(k,m):m({features:b.graphics})},_getScreenPoints:function(b,a,d){var c=[],p=b.length,e=0,g=0,h,m=new x(a.extent.xmin,a.extent.ymax,a.spatialReference),k=a.toScreen(m),f=k.x,k=k.y,l=a.getResolution(),n;for((g=a.extent.getCacheValue("_parts"))&&(n=q.map(g,function(b){return d._intersects(a,b.extent)[0]}));p--;)g=b[p],g.geometry&&(h={x:Math.ceil((g.geometry.x-m.x)/l+f),y:Math.floor((m.y-g.geometry.y)/l-k),attributes:g.attributes},n&&(g=1<n.length&&h.x<
-n[0]?n[1]:n[0],h.x+=g),c[e++]=h);return c},_getImageBySourceId:function(b){var a=this.imageLayer.getImages(),a=q.filter(a,function(a){return a.sourceId==b});if(a.length)return a[a.length-1]},_swapMapImages:function(b,a){function d(){c.removeImage(a)}var c=this.imageLayer,e=this.sourceLayer.opacity||1;c.addImage(b);s.anim(b._node,{opacity:e},null,null,function(){b.opacity=e});null!=a&&s.anim(a._node,{opacity:0},null,null,d)},_removeHandlers:function(){if(null!=this._hndls)for(var b=this._hndls.length;b--;)this._hndls[b].remove()},
_getOptions:function(){var b=this.heatmapRenderer;return{blurRadius:b.blurRadius,gradient:b.gradient,maxPixelIntensity:b.maxPixelIntensity,minPixelIntensity:b.minPixelIntensity,field:b.field,fieldOffset:b.fieldOffset}},_resetGraphics:function(){clearTimeout(this._resetTimer);this._resetTimer=null;for(var b=this.sourceLayer.graphics,a=b.length,d;a--;)d=b[a],d._shape=d._offsets=void 0}});w("extend-esri")&&l.setObject("layers.HeatmapManager",e,v);return e});