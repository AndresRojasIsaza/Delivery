// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.14/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/base/conditionals/ISO19139A1_ROW7","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/topic dojo/has ../../../../../../kernel dojo/i18n!../../../../nls/i18nArcGIS ../../../../base/Conditional".split(" "),function(c,h,p,g,k,l,m,n){c=c(n,{key:"ISO19139A1_ROW7",postCreate:function(){this.inherited(arguments);var e=this;this.own(g.subscribe("gxe/interaction-occurred",function(a){try{if(e.parentXNode&&a&&a.inputWidget&&a.inputWidget.parentXNode){var b=a.inputWidget.parentXNode.gxePath,
d=e.parentXNode.gxePath;(b===d+"/accessConsts/RestrictCd/@value"||b===d+"/useConsts/RestrictCd/@value"||b===d+"/othConsts")&&e.emitInteractionOccurred()}}catch(c){console.error(c)}}));this.own(g.subscribe("gxe/after-xnode-destroyed",function(a){try{if(e.parentXNode&&a&&a.xnode){var b=a.xnode.target;("accessConsts"===b||"useConsts"===b||"othConsts"===b)&&e.emitInteractionOccurred()}}catch(d){console.error(d)}}))},validateConditionals:function(e){var a=this.newStatus({message:m.conditionals[this.key]}),
b=!0,d=this.parentXNode.domNode,c=!1,f=this.parentXNode.gxePath,g=f+"/accessConsts/RestrictCd/@value",h=f+"/useConsts/RestrictCd/@value",f=f+"/othConsts";this.isXNodeOff(this.parentXNode)||this.forActiveXNodes(g+","+h,d,function(a){if("008"===a.inputWidget.getInputValue())return c=!0});c&&(b=!1,this.forActiveXNodes(f,d,function(a){if(!this.isXNodeInputEmpty(a))return b=!0},this));a.isValid=b;this.track(a,e);return a}});k("extend-esri")&&h.setObject("dijit.metadata.types.arcgis.base.conditionals.ISO19139A1_ROW7",
c,l);return c});