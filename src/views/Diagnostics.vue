<template>
  <div class="mb-3">
    <v-layout row>
      <h2>Browser Diagnostics</h2>
    </v-layout>

    <v-layout row class="mt-3 mb-3">
      <h4>Web Audio Support</h4>
    </v-layout>
    <v-layout row wrap style="padding-left:1em">
      <v-flex xs12>
        <ul>
          <li><span class="lbl">AudioContext</span> : <span class="val">{{ audioContextStr }}</span></li>
          <li><span class="lbl">webkitAudioContext</span> : <span class="val">{{ webkitAudioContextStr }}</span>
          <li><span class="lbl">MediaRecorder</span> : <span class="val">{{ mediaRecorderOrigStr }}</span>
          <li><span class="lbl">MediaRecorder(Polyfilled)</span> : <span
            class="val">{{ mediaRecorderPoly }}</span>
          </li>
        </ul>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>Supported MediaRecorder Mime Types</h4>
    </v-layout>
    <v-layout row wrap style="padding-left:1em">
      <v-flex xs12>
        <ul>
          <li v-for="mimetype in supportedMimeTypes" v-bind:key="mimetype.name">
            <span class="lbl">{{ mimetype.name }}</span> : <span class="val">{{ mimetype.supported }}</span>
          </li>
        </ul>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>References and Demos</h4>
    </v-layout>
    <v-layout row wrap style="padding-left:1em">
      <v-flex xs12>
        <ul>
          <li><a
            href="https://higuma.github.io/web-audio-recorder-js/">https://higuma.github.io/web-audio-recorder-js/</a> -
            Doesn't work on iOS/Safari. Didn't seem to work in Edge either, but not clear why.
          </li>
          <li><a href="https://webrtc.github.io/samples/src/content/devices/input-output/">https://webrtc.github.io/samples/src/content/devices/input-output/</a>
            - Doesn't work on iOS/Safari or Edge.
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Diagnostics',
  data () {
    return {
      supportedMimeTypes: [],
      mediaRecorderOrigStr: typeof window.MediaRecorder,
      mediaRecorderPoly: ''
    }
  },
  computed: {
    audioContextStr () {
      // var AudioContext = window.AudioContext || window.webkitAudioContext;
      // var audioCtx = new AudioContext();
      return typeof window.AudioContext
    },
    webkitAudioContextStr () {
      return typeof window.webkitAudioContext
    }
  },
  created () {
    const types = [
      'audio/vorbis',
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/aac',
      'audio/mpeg',
      'audio/mp4',
      'audio/x-wav',
      'audio/wav',
      'video/quicktime',
      'video/webm',
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9',
      'video/webm;codecs=h264',
      'video/mp4']

    let MediaRecorder = require('audio-recorder-polyfill-kaliatech')
    this.mediaRecorderPoly = !MediaRecorder.notSupported

    for (const i in types) {
      if (MediaRecorder && MediaRecorder.isTypeSupported) {
        this.supportedMimeTypes.push({name: types[i], supported: MediaRecorder.isTypeSupported(types[i])})
      }
      else {
        this.supportedMimeTypes.push({name: types[i], supported: '-'})
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
  .lbl {
    display: inline-block;
    width: 15em;
  }

  .val {
    margin-left: 1em;
  }
</style>
