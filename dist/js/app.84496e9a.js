webpackJsonp([1],{0:function(e,t,i){e.exports=i("NHnr")},"0ii+":function(e,t){},L3s7:function(e,t){},NHnr:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});i("j1ja");var s=i("/5sW"),r=i("3EgV"),o=i.n(r),n=(i("VjuZ"),i("Z60a")),a=i.n(n),c=i("C9uT"),d=i.n(c),l=(i("TFWu"),"audio/wave"),u=function(){var e=2,t=[];function i(i){for(var s=i.length,r=new Uint8Array(s*e),o=0;o<s;o++){var n=o*e,a=i[o];a>1?a=1:a<-1&&(a=-1),a*=32768,r[n]=a,r[n+1]=a>>8}t.push(r)}function s(i){var s=t.length?t[0].length:0,r=t.length*s,o=new Uint8Array(44+r),n=new DataView(o.buffer);n.setUint32(0,1380533830,!1),n.setUint32(4,36+r,!0),n.setUint32(8,1463899717,!1),n.setUint32(12,1718449184,!1),n.setUint32(16,16,!0),n.setUint16(20,1,!0),n.setUint16(22,1,!0),n.setUint32(24,i,!0),n.setUint32(28,i*e,!0),n.setUint16(32,e,!0),n.setUint16(34,8*e,!0),n.setUint32(36,1684108385,!1),n.setUint32(40,r,!0);for(var a=0;a<t.length;a++)o.set(t[a],a*s+44);t=[],postMessage(o.buffer,[o.buffer])}onmessage=function(e){"encode"===e.data[0]?i(e.data[1]):"dump"===e.data[0]?s(e.data[1]):"close"===e.data[0]&&this.close()}},h=function(){function e(){a()(this,e),window.AudioContext=window.AudioContext||window.webkitAudioContext,this.em=document.createDocumentFragment(),this.stopTracksAndCloseCtxWhenFinished=!0,this.state="inactive",this.chunks=[],this.chunkType="",this.usingMediaRecorder=window.MediaRecorder||!1}return d()(e,[{key:"createWorker",value:function(e){var t=e.toString().replace(/^function\s*\(\)\s*{/,"").replace(/}$/,""),i=new Blob([t]);return new Worker(URL.createObjectURL(i))}},{key:"startRecording",value:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if("inactive"===this.state){this.audioCtx=new AudioContext,this.micGainNode=this.audioCtx.createGain(),this.outputGainNode=this.audioCtx.createGain(),!i&&this.usingMediaRecorder||(this.processorNode=this.audioCtx.createScriptProcessor(2048,1,1)),this.audioCtx.createMediaStreamDestination?this.destinationNode=this.audioCtx.createMediaStreamDestination():this.destinationNode=this.audioCtx.destination,this.usingMediaRecorder||(this.encoderWorker=this.createWorker(u),this.encoderWorker.addEventListener("message",function(e){var i=new Event("dataavailable");i.data=new Blob([e.data],{type:l}),t._onDataAvailable(i)}));var s={audio:!0};return navigator.mediaDevices.getUserMedia(s).then(function(i){t._startRecordingWithStream(i,e)})}}},{key:"_startRecordingWithStream",value:function(e,t){var i=this;this.micAudioStream=e,this.inputStreamNode=this.audioCtx.createMediaStreamSource(this.micAudioStream),this.audioCtx=this.inputStreamNode.context,this.processorNode&&(this.processorNode.onaudioprocess=function(e){return i._onAudioProcess(e)}),this.micGainNode.gain.setValueAtTime(1,this.audioCtx.currentTime),this.inputStreamNode.connect(this.micGainNode),this.state="recording",this.processorNode?(this.micGainNode.connect(this.processorNode),this.processorNode.connect(this.outputGainNode),this.outputGainNode.connect(this.destinationNode)):(this.micGainNode.connect(this.outputGainNode),this.outputGainNode.connect(this.destinationNode)),this.usingMediaRecorder?(this.mediaRecorder=new MediaRecorder(this.destinationNode.stream),this.mediaRecorder.addEventListener("dataavailable",function(e){return i._onDataAvailable(e)}),this.mediaRecorder.addEventListener("error",function(e){return i._onError(e)}),this.mediaRecorder.start(t)):(this.outputGainNode.gain.setValueAtTime(0,this.audioCtx.currentTime),t&&(console.log("Time slicing without MediaRecorder is not yet supported. The resulting recording will not be playable."),this.slicing=setInterval(function(){"recording"===this.state&&this.encoderWorker.postMessage(["dump",this.context.sampleRate])},t)))}},{key:"_onAudioProcess",value:function(e){this.usingMediaRecorder||"recording"===this.state&&this.encoderWorker.postMessage(["encode",e.inputBuffer.getChannelData(0)])}},{key:"stopRecording",value:function(){var e=this;"inactive"!==this.state&&(this.usingMediaRecorder?(this.state="inactive",this.mediaRecorder.stop()):(this.encoderWorker.postMessage(["dump",this.audioCtx.sampleRate]),clearInterval(this.slicing),setTimeout(function(){e.state="inactive",e.encoderWorker.postMessage(["dump",e.audioCtx.sampleRate])},100)))}},{key:"_onDataAvailable",value:function(e){if(this.chunks.push(e.data),this.chunkType=e.data.type,"inactive"===this.state){var t=new Blob(this.chunks,{type:this.chunkType}),i=URL.createObjectURL(t),s={ts:(new Date).getTime(),blobUrl:i,mimeType:t.type,size:t.size};this.chunks=[],this.chunkType=null,this.destinationNode&&(this.destinationNode.disconnect(),this.destinationNode=null),this.outputGainNode&&(this.outputGainNode.disconnect(),this.outputGainNode=null),this.processorNode&&(this.processorNode.disconnect(),this.processorNode=null),this.encoderWorker&&(this.encoderWorker.postMessage(["close"]),this.encoderWorker=null),this.micGainNode&&(this.micGainNode.disconnect(),this.micGainNode=null),this.inputStreamNode&&(this.inputStreamNode.disconnect(),this.inputStreamNode=null),this.stopTracksAndCloseCtxWhenFinished&&(this.micAudioStream.getTracks().forEach(function(e){return e.stop()}),this.micAudioStream=null,this.audioCtx.close(),this.audioCtx=null),this.em.dispatchEvent(new CustomEvent("recording",{detail:{recording:s}}))}}},{key:"_onError",value:function(e){console.log("error",e),this.em.dispatchEvent(new Event("error")),alert("error:"+e)}}]),e}(),v=new h,p=(i("MfeA"),function(){function e(){a()(this,e)}return d()(e,[{key:"humanFileSize",value:function(e,t){var i=t?1e3:1024;if(Math.abs(e)<i)return e+" B";var s=t?["kB","MB","GB","TB","PB","EB","ZB","YB"]:["KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"],r=-1;do{e/=i,++r}while(Math.abs(e)>=i&&r<s.length-1);return e.toFixed(1)+" "+s[r]}},{key:"isIosSafari",value:function(){return navigator.userAgent.match(/iP(od|hone|ad)/)&&navigator.userAgent.match(/AppleWebKit/)&&!navigator.userAgent.match(/(Cr|Fx|OP)iOS/)}}]),e}()),m=new p,g={name:"Test1",filters:{fileSizeToHumanSize:function(e){return m.humanFileSize(e,!0)}},data:function(){return{recordingInProgress:!1,supportedMimeTypes:[],recordings:[],cleanupWhenFinished:!0}},created:function(){var e=this;v.stopTracksAndCloseCtxWhenFinished=this.cleanupWhenFinished,v.em.addEventListener("recording",function(t){return e.onNewRecording(t)})},watch:{cleanupWhenFinished:function(e){v.stopTracksAndCloseCtxWhenFinished=this.cleanupWhenFinished}},methods:{startRecording:function(){var e=this;v.startRecording().then(function(){e.recordingInProgress=!0}).catch(function(e){console.error("Exception while start recording: "+e),alert("Exception while start recording: "+e.message)})},stopRecording:function(){v.stopRecording(),this.recordingInProgress=!1},onNewRecording:function(e){this.recordings.push(e.detail.recording)}}},f=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-container",[i("v-layout",{attrs:{row:"",wrap:""}},[i("div",{staticClass:"test1"},[i("h3",[e._v("Repeatable Recording & Playback")]),i("p",[e._v("Click start/stop multiple times to create multiple recordings. Works on all modern browser/device\n        combinations, including iOS/Safari 11.2.x and newer.")]),i("div",[i("v-btn",{attrs:{disabled:e.recordingInProgress},on:{click:e.startRecording}},[e._v("Start Recording\n        ")]),i("v-btn",{attrs:{disabled:!e.recordingInProgress},on:{click:e.stopRecording}},[e._v("Stop Recording")]),i("v-icon",{class:e.recordingInProgress?"live":""},[e._v("mic")])],1)])]),i("v-layout",{staticClass:"ml-1 mt-1",attrs:{row:"",wrap:""}},[i("v-checkbox",{attrs:{label:"Stop tracks and close audio context when recording stopped"},model:{value:e.cleanupWhenFinished,callback:function(t){e.cleanupWhenFinished=t},expression:"cleanupWhenFinished"}})],1),e.recordings.length>0?i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Recordings")]),e._l(e.recordings,function(t,s){return i("div",{key:t.ts},[i("v-card",[i("v-card-title",{attrs:{"primary-title":""}},[i("v-layout",{attrs:{column:"",wrap:""}},[i("div",[i("h3",[e._v("Recording #"+e._s(s+1))])]),i("div",{staticClass:"ml-3"},[i("div",[i("audio",{attrs:{src:t.blobUrl,controls:"true"}})]),i("div",[e._v("\n                size: "+e._s(e._f("fileSizeToHumanSize")(t.size))+", type: "+e._s(t.mimeType)+"\n              ")])])])],1)],1),s!==e.recordings.length-1?i("v-divider"):e._e()],1)})],2):e._e(),i("v-layout",{staticClass:"mt-5",attrs:{column:"",wrap:""}},[i("h4",[e._v("Notes\n      "),i("small",[e._v("(as of iOS 11.2.6)")])]),i("v-divider"),i("p",[e._v("\n      There are multiple valid ways to do audio recording and playback on every browser/device combination\n      "),i("i",[e._v("except")]),e._v(" iOS/Safari. I believe there are four significant issues, and only the first one seems to be well\n      known.\n    ")]),i("div",{staticClass:"ml-4"},[i("ul",[i("li",[i("strong",[e._v("Security context of the getUserMedia handler is important")]),e._v(" - "),i("br"),i("p",[e._v("\n            The most common and widely known issue issue is that the success handler of the getUserMedia is no longer\n            in the context of the user click. As a result, any audio context and processors created in the handler\n            won't work. The solution is to create the audio context and any processors before calling getUserMedia,\n            while still in the user click handler context. Then once getUserMedia provides the stream,\n            use the previously created constructs to setup the graph and start recording.\n          ")])]),i("li",[i("strong",[e._v("Multiple recordings require new audio streams")]),e._v(" - "),i("br"),i("p",[e._v("\n            There are a number of demos that work for the first recording on iOS/Safari, that then fail with empty\n            audio on subsequent recordings until page is reloaded. The reason is that after stopping recording and\n            extracting playable blob, the next recording requires a new AudioStream. This AudioStream can come\n            from another call to getUserMedia (which won't prompt user after the first time), or potentially, by\n            cloning the existing audio stream.\n          ")])]),i("li",[i("strong",[e._v("Red recording bar indicator")]),e._v(" - "),i("br"),i("p",[e._v("\n            After granting permission to microphone, iOS/Safari will show a red bar notification anytime user switches\n            away from the tab where permission was granted. To clear this bar, the recording stream's tracks can be\n            stopped after recording is finished. This can be tested with the checkbox above. Stopping the tracks and\n            closing the audio context is straightforward and works well, except for this last issue (but see updates):\n          ")])]),i("li",[i("strong",[i("del",[e._v("A sleep/lock/switch event can easily break things, is not detectable, and is not easily\n            recoverable\n          ")])]),e._v(" - "),i("br"),i("del",[i("p",[e._v("\n              To see this, make a recording and verify it plays. Switch to mail app, then back to safari and\n              make/verify\n              another recording. As long as red bar/microphone is still visible, it generally works. Then, check the\n              option to stop tracks and close audio context. Make another recording and verify. Switch to mail app and\n              back and try to make another recording. Most of the time the recording will appear to work, but the\n              audio\n              will be silent. As far as I can tell, there is no way to detect this, and there is no way to recover\n              without loading a new tab or force quitting Safari.\n            ")]),i("p",[i("em",[e._v("If")]),e._v(" the tracks are not stopped and so the red bar/icon remains, then this occurs much less\n              frequently. Of course, that means the red bar is constantly visible though. And even then, starting\n              another app that uses the microphone will almost always break things again. I have not been able to find\n              a\n              way to detect, much less, programmatically fix things, when this occurs. My assumption is that the\n              underlying issue is due to low level iOS/Safari bugs, and not in how this code is setting things up.")])])]),i("li",[i("strong",[e._v("Any references not cleaned up after recording complete can affect stability")]),e._v(" - "),i("br"),e._v("\n          UPDATED 2018-04-10: After writing the previous section, I rewrote a number of things and removed all\n          dependencies. By doing that I was able to ensure that everything gets cleaned up when recording is\n          complete. I now no longer have stability issues on iOS, though I don't know exactly what was causing\n          it previously. I thought perhaps it was the web worker, which I now close when recording is complete. But\n          quick testing shows that even if I don't close the webworker, this new handling seems to be stable after\n          sleep/lock/switch events.\n        ")])])])],1),i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Relevant")]),i("v-divider"),i("div",{staticClass:"ml-4"},[i("ul",[i("li",[i("a",{attrs:{href:"https://github.com/muaz-khan/RecordRTC/issues/324"}},[e._v("https://github.com/muaz-khan/RecordRTC/issues/324")])]),i("li",[i("a",{attrs:{href:"https://github.com/ai/audio-recorder-polyfill/issues/4"}},[e._v("https://github.com/ai/audio-recorder-polyfill/issues/4")])]),i("li",[i("a",{attrs:{href:"https://github.com/danielstorey/webrtc-audio-recording"}},[e._v("https://github.com/danielstorey/webrtc-audio-recording")])])])])],1),i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Source")]),i("v-divider"),i("div",{staticClass:"ml-4"},[i("ul",[i("li",[i("a",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test1.vue"}},[e._v("src/views/Test1.vue")]),i("ul",{staticClass:"ml-3"},[i("li",[e._v("Primarily: "),i("a",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/shared/RecorderService.js"}},[e._v("src/shared/RecorderService.js")])])])])])])],1)],1)},w=[],b=i("XyMi");function _(e){i("L3s7")}var y=!1,k=_,C="data-v-70fe2cc9",R=null,x=Object(b["a"])(g,f,w,y,k,C,R),S=x.exports,T={name:"app",components:{Test1:S},data:function(){return{drawer:!1}}},M=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"app"}},[i("v-app",[i("v-navigation-drawer",{attrs:{fixed:"",temporary:"",app:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[i("v-list",{attrs:{dense:""}},[i("v-list-tile",{attrs:{to:"/"}},[i("v-list-tile-action",[i("v-icon",[e._v("home")])],1),i("v-list-tile-content",[i("v-list-tile-title",[e._v("Home")])],1)],1),i("v-list-tile",{attrs:{to:"/diagnostics"}},[i("v-list-tile-action",[i("v-icon",[e._v("mic")])],1),i("v-list-tile-content",[i("v-list-tile-title",[e._v("Diagnostics")])],1)],1),i("v-list-tile",{attrs:{to:"/test1"}},[i("v-list-tile-action",[i("v-icon",[e._v("mic")])],1),i("v-list-tile-content",[i("v-list-tile-title",[e._v("1 - Repeatable Recording")])],1)],1),i("v-list-tile",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests"}},[i("v-list-tile-action",[i("v-icon",[e._v("code")])],1),i("v-list-tile-content",[i("v-list-tile-title",[e._v("View on Github")])],1)],1)],1)],1),i("v-toolbar",{attrs:{color:"grey",dark:"",fixed:"",app:""}},[i("v-toolbar-side-icon",{on:{click:function(t){t.stopPropagation(),e.drawer=!e.drawer}}}),i("v-toolbar-title",[e._v("Web Audio Tests")]),i("v-spacer"),i("a",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests"}},[i("v-icon",{attrs:{large:""}},[e._v("code")])],1)],1),i("v-content",[i("v-container",{staticClass:"scroll-container",attrs:{fluid:""}},[i("div",[i("router-view")],1)])],1)],1)],1)},A=[];function N(e){i("OYMq")}var E=!1,W=N,P=null,U=null,O=Object(b["a"])(T,M,A,E,W,P,U),B=O.exports,F=i("/ocq"),I={name:"Home",components:{},data:function(){return{}}},D=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-container",[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{md3:""}}),i("v-flex",{attrs:{md6:""}},[i("div",{staticClass:"text-xs-center home--menu"},[i("p",[e._v("\n            Tests to verify functionality of web audio api across all browsers. Particularly on iOS/Safari 11.2.x as it\n            is very strict on security context and has "),i("del",[e._v("bugs")]),i("em",[e._v("special features")]),e._v(".\n          ")]),i("div",[i("v-btn",{attrs:{color:"info",to:"/diagnostics"}},[e._v("Browser Diagnostics")])],1),i("div",[i("v-btn",{attrs:{color:"info",to:"/test1"}},[e._v("1 - Recording and Playback")])],1)])]),i("v-flex",{attrs:{md3:""}})],1)],1)},G=[];function z(e){i("uCOA")}var j=!1,L=z,q=null,H=null,$=Object(b["a"])(I,D,G,j,L,q,H),V=$.exports,Y=i("Oy1H"),Z=i.n(Y),K={name:"Diagnostics",data:function(){return{supportedMimeTypes:[],mediaRecorderOrigStr:Z()(window.MediaRecorder),mediaRecorderPolyfilled:"false"}},computed:{audioContextStr:function(){return Z()(window.AudioContext)},webkitAudioContextStr:function(){return Z()(window.webkitAudioContext)}},created:function(){var e=["audio/vorbis","audio/webm","audio/webm;codecs=opus","audio/aac","audio/mpeg","audio/mp4","audio/x-wav","audio/wav","video/quicktime","video/webm","video/webm;codecs=vp8","video/webm;codecs=vp9","video/webm;codecs=h264","video/mp4"];for(var t in e)MediaRecorder&&MediaRecorder.isTypeSupported?this.supportedMimeTypes.push({name:e[t],supported:MediaRecorder.isTypeSupported(e[t])}):this.supportedMimeTypes.push({name:e[t],supported:"-"})},methods:{}},J=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"mb-3"},[i("v-layout",{attrs:{row:""}},[i("h2",[e._v("Browser Diagnostics")])]),i("v-layout",{staticClass:"mt-3 mb-3",attrs:{row:""}},[i("h4",[e._v("Web Audio Support")])]),i("v-layout",{staticStyle:{"padding-left":"1em"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:""}},[i("ul",[i("li",[i("span",{staticClass:"lbl"},[e._v("AudioContext")]),e._v(" : "),i("span",{staticClass:"val"},[e._v(e._s(e.audioContextStr))])]),i("li",[i("span",{staticClass:"lbl"},[e._v("webkitAudioContext")]),e._v(" : "),i("span",{staticClass:"val"},[e._v(e._s(e.webkitAudioContextStr))])]),i("li",[i("span",{staticClass:"lbl"},[e._v("MediaRecorder")]),e._v(" : "),i("span",{staticClass:"val"},[e._v(e._s(e.mediaRecorderOrigStr))])]),i("li",[i("span",{staticClass:"lbl"},[e._v("MediaRecorder(Polyfilled)")]),e._v(" : "),i("span",{staticClass:"val"},[e._v(e._s(e.mediaRecorderPolyfilled))])])])])],1),i("v-layout",{staticClass:"mt-3",attrs:{row:""}},[i("h4",[e._v("Supported MediaRecorder Mime Types")])]),i("v-layout",{staticStyle:{"padding-left":"1em"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:""}},[i("ul",e._l(e.supportedMimeTypes,function(t){return i("li",{key:t.name},[i("span",{staticClass:"lbl"},[e._v(e._s(t.name))]),e._v(" : "),i("span",{staticClass:"val"},[e._v(e._s(t.supported))])])}))])],1),i("v-layout",{staticClass:"mt-3",attrs:{row:""}},[i("h4",[e._v("References and Demos")])]),i("v-layout",{staticStyle:{"padding-left":"1em"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:""}},[i("ul",[i("li",[i("a",{attrs:{href:"https://higuma.github.io/web-audio-recorder-js/"}},[e._v("https://higuma.github.io/web-audio-recorder-js/")]),e._v(" -\n          Doesn't work on iOS/Safari. Didn't seem to work in Edge either, but not clear why.\n        ")]),i("li",[i("a",{attrs:{href:"https://webrtc.github.io/samples/src/content/devices/input-output/"}},[e._v("https://webrtc.github.io/samples/src/content/devices/input-output/")]),e._v("\n          - Doesn't work on iOS/Safari or Edge.\n        ")])])])],1)],1)},X=[];function Q(e){i("0ii+")}var ee=!1,te=Q,ie="data-v-54cee3d3",se=null,re=Object(b["a"])(K,J,X,ee,te,ie,se),oe=re.exports,ne={name:"Test1",filters:{fileSizeToHumanSize:function(e){return m.humanFileSize(e,!0)}},data:function(){return{recordingInProgress:!1,supportedMimeTypes:[],recordings:[],cleanupWhenFinished:!0}},created:function(){var e=this;v.em.addEventListener("recording",function(t){return e.onNewRecording(t)})},methods:{startRecording:function(){var e=this;v.startRecording().then(function(){e.recordingInProgress=!0}).catch(function(e){console.error("Exception while start recording: "+e),alert("Exception while start recording: "+e.message)})},stopRecording:function(){v.stopRecording(),this.recordingInProgress=!1},onNewRecording:function(e){this.recordings.push(e.detail.recording)}}},ae=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-container",[i("v-layout",{attrs:{row:"",wrap:""}},[i("div",{staticClass:"test2"},[i("h3",[e._v("Recording with Audio Process Events")]),i("p",[e._v("Test to verify it's possible record while simultaneously processing data.")]),i("div",[i("v-btn",{attrs:{disabled:e.recordingInProgress},on:{click:e.startRecording}},[e._v("Start Recording\n        ")]),i("v-btn",{attrs:{disabled:!e.recordingInProgress},on:{click:e.stopRecording}},[e._v("Stop Recording")]),i("v-icon",{class:e.recordingInProgress?"live":""},[e._v("mic")])],1)])]),e.recordings.length>0?i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Recordings")]),e._l(e.recordings,function(t,s){return i("div",{key:t.ts},[i("v-card",[i("v-card-title",{attrs:{"primary-title":""}},[i("v-layout",{attrs:{column:"",wrap:""}},[i("div",[i("h3",[e._v("Recording #"+e._s(s+1))])]),i("div",{staticClass:"ml-3"},[i("div",[i("audio",{attrs:{src:t.blobUrl,controls:"true"}})]),i("div",[e._v("\n                size: "+e._s(e._f("fileSizeToHumanSize")(t.size))+", type: "+e._s(t.mimeType)+"\n              ")])])])],1)],1),s!==e.recordings.length-1?i("v-divider"):e._e()],1)})],2):e._e(),i("v-layout",{attrs:{column:"",wrap:""}},[i("span",{attrs:{id:""}},[e._v("..")])]),i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Relevant")]),i("v-divider"),i("div",{staticClass:"ml-4"},[i("ul",[i("li",[i("a",{attrs:{href:"https://github.com/muaz-khan/RecordRTC/issues/324"}},[e._v("https://github.com/muaz-khan/RecordRTC/issues/324")])]),i("li",[i("a",{attrs:{href:"https://github.com/ai/audio-recorder-polyfill/issues/4"}},[e._v("https://github.com/ai/audio-recorder-polyfill/issues/4")])]),i("li",[i("a",{attrs:{href:"https://github.com/danielstorey/webrtc-audio-recording"}},[e._v("https://github.com/danielstorey/webrtc-audio-recording")])]),i("li",[i("a",{attrs:{href:"https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/"}},[e._v("https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/")])]),i("ul",[i("li",[i("a",{attrs:{href:"https://github.com/MicrosoftEdge/Demos/blob/master/microphone"}},[e._v("https://github.com/MicrosoftEdge/Demos/blob/master/microphone")])])])])])],1),i("v-layout",{attrs:{column:"",wrap:""}},[i("h4",{staticClass:"mt-3"},[e._v("Source")]),i("v-divider"),i("div",{staticClass:"ml-4"},[i("ul",[i("li",[i("a",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test2.vue"}},[e._v("src/views/Test2.vue")]),i("ul",{staticClass:"ml-3"},[i("li",[e._v("Primarily: "),i("a",{attrs:{href:"https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/shared/RecorderService.js"}},[e._v("src/shared/RecorderService.js")])])])])])])],1)],1)},ce=[];function de(e){i("TtFC")}var le=!1,ue=de,he="data-v-027c4b20",ve=null,pe=Object(b["a"])(ne,ae,ce,le,ue,he,ve),me=pe.exports;s["a"].use(F["a"]);var ge=new F["a"]({mode:"hash",routes:[{path:"/",name:"home",component:V},{path:"/diagnostics",name:"diagnostics",component:oe},{path:"/test1",name:"test1",component:S},{path:"/test2",name:"test2",component:me}]}),fe=ge;s["a"].use(o.a,{theme:{primary:"#546E7A",secondary:"#B0BEC5",accent:"#448AFF",error:"#EF5350",warning:"#FFF176",info:"#2196f3",success:"#4caf50"}}),s["a"].config.productionTip=!1,new s["a"]({router:fe,render:function(e){return e(B)}}).$mount("#app")},OYMq:function(e,t){},TtFC:function(e,t){},uCOA:function(e,t){}},[0]);
//# sourceMappingURL=app.84496e9a.js.map