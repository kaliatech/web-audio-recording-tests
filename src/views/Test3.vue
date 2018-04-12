<template>
  <v-container mb-5>
    <v-layout row wrap>
      <div class="test2">
        <h3>Test 3
            <span v-if="$vuetify.breakpoint.xsOnly"><br></span>
            <span v-if="!$vuetify.breakpoint.xsOnly"> - </span>
            Script Processors w/ Peak Levels
        </h3>
        <p>Recording with multiple simultaneous script processors. In this case, showing peak levels of recording pre and post gain.</p>
        <div>
          <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
          </v-btn>
          <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
          <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
        </div>
      </div>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1">
      <v-flex xs10 md6>
        <v-slider label="Mic Gain" :max="500" v-model="micGainSlider"></v-slider>
      </v-flex>
      <v-flex xs2>
        <div class="input-group">
          <label>{{ micGain }}</label>
        </div>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <h4 class="mt-3">Recording Peak Meters</h4>
    </v-layout>

    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs6 sm2>
        <div id="peak-meter-raw" style="width: 5em; height: 10em; margin: 1em 0; border:1px solid gray"></div>
        <p>Raw</p>
      </v-flex>
      <v-flex xs6 sm2>
        <div id="peak-meter-postgain" style="width: 5em; height: 10em; margin: 1em 0;  border:1px solid gray"></div>
        PostGain
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>

    <v-layout column wrap v-if="recordings.length > 0">
      <h4 class="mt-3">Recordings</h4>
      <v-divider></v-divider>
      <div v-for="(recording,idx) in recordings" :key="recording.ts">
        <v-card>
          <v-card-title primary-title>
            <v-layout column wrap>
              <div>
                <h3>Recording #{{ idx + 1 }}</h3>
              </div>
              <div class="ml-3">
                <div>
                  <audio :src="recording.blobUrl" controls="true"/>
                </div>
                <div>
                  size: {{recording.size | fileSizeToHumanSize}}, type: {{recording.mimeType}}
                </div>
              </div>
            </v-layout>
          </v-card-title>
        </v-card>
        <v-divider v-if="idx !== (recordings.length-1)"/>
      </div>
    </v-layout>

    <v-layout column wrap>
      <h4 class="mt-3">Source</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test3.vue">src/views/Test3.vue</a>
            <ul class="ml-3">
              <li>Primarily: <a
                href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/shared/RecorderService.js">src/shared/RecorderService.js</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </v-layout>

    <v-layout column wrap hidden-xs-only>
      <h4 class="mt-3">Relevant</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/muaz-khan/RecordRTC/issues/324">https://github.com/muaz-khan/RecordRTC/issues/324</a>
          </li>
          <li><a href="https://github.com/ai/audio-recorder-polyfill/issues/4">https://github.com/ai/audio-recorder-polyfill/issues/4</a>
          </li>
          <li><a href="https://github.com/danielstorey/webrtc-audio-recording">https://github.com/danielstorey/webrtc-audio-recording</a>
          </li>
          <li><a href="https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/">https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/</a>
          </li>
          <ul>
            <li><a href="https://github.com/MicrosoftEdge/Demos/blob/master/microphone">https://github.com/MicrosoftEdge/Demos/blob/master/microphone</a>
            </li>
          </ul>
          <li><a href="https://github.com/esonderegger/web-audio-peak-meter">https://github.com/esonderegger/web-audio-peak-meter</a></li>
        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import RecorderService from '@/shared/RecorderService'
import utils from '@/shared/Utils'
import WebAudioPeakMeter from '@/shared/WebAudioPeakMeter'

// Couldn't use the original library because it doesn't support more than one instance on page due to the module structure
// import webAudioPeakMeter from 'web-audio-peak-meter'
let webAudioPeakMeter1 = new WebAudioPeakMeter()
let webAudioPeakMeter2 = new WebAudioPeakMeter()

export default {
  name: 'Test3',
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  data () {
    return {
      micGainSlider: 100,
      micGain: 1.0,
      recordingInProgress: false,
      supportedMimeTypes: [],
      recordings: [],
      cleanupWhenFinished: true
    }
  },
  watch: {
    micGainSlider () {
      this.micGain = (this.micGainSlider * 0.01).toFixed(2)
      this.recorderSrvc.setMicGain(this.micGain)
    }
  },
  created () {
    this.recorderSrvc = new RecorderService()
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
    this.recorderSrvc.onGraphSetupWithInputStream = (inputStreamNode) => {
      this.meterNodeRaw = webAudioPeakMeter1.createMeterNode(inputStreamNode, this.recorderSrvc.audioCtx)
      webAudioPeakMeter1.createMeter(this.peakMeterRawEl, this.meterNodeRaw, {})
    }
  },
  mounted () {
    this.peakMeterRawEl = document.getElementById('peak-meter-raw')
    this.peakMeterPostGainEl = document.getElementById('peak-meter-postgain')
  },
  methods: {
    startRecording () {
      this.recorderSrvc.startRecording()
        .then(() => {
          this.recordingInProgress = true

          this.meterNodePostGain = webAudioPeakMeter2.createMeterNode(this.recorderSrvc.micGainNode, this.recorderSrvc.audioCtx)
          webAudioPeakMeter2.createMeter(this.peakMeterPostGainEl, this.meterNodePostGain, {})
        })
        .catch((error) => {
          console.error('Exception while start recording: ' + error)
          alert('Exception while start recording: ' + error.message)
        })
    },
    stopRecording () {
      this.recorderSrvc.stopRecording()
      this.recordingInProgress = false

      this.meterNodeRaw.disconnect()
      this.meterNodeRaw = null
      this.peakMeterRawEl.innerHTML = ''

      this.meterNodePostGain.disconnect()
      this.meterNodePostGain = null
      this.peakMeterPostGainEl.innerHTML = ''
    },
    onNewRecording (evt) {
      this.recordings.push(evt.detail.recording)
    }
  }
}
</script>
<style lang="stylus" scoped="true">
  @import '~vuetify/src/stylus/settings/_variables'
  @media screen and (min-width: $grid-breakpoints.sm)
    audio
      width 35em

  @media screen and (max-width: ($grid-breakpoints.sm - 1))
    audio
      width 100%

  .live
    color red
</style>
