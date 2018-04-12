<template>
  <v-container mb-5>
    <v-layout row wrap>

      <div class="test2">
        <h3>Test 5
          <span v-if="$vuetify.breakpoint.xsOnly"><br></span>
          <span v-if="!$vuetify.breakpoint.xsOnly"> - </span>
          Analyzer Node
        </h3>
        <p>Test using analyzer node.
        </p>
      </div>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1">
      <div>
        <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
        </v-btn>
        <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
        <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
      </div>
    </v-layout>

    <v-layout row wrap class="mt-1">
      <v-flex xs12>
        <h4 class="mt-3">FFT Visualization</h4>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <canvas style="border: 1px solid black; width:100%; height:20em"></canvas>
      </v-flex>
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
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test5.vue">src/views/Test5.vue</a>
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
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode">https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode</a>
          </li>
          <li><a href="http://webaudioapi.com/samples/visualizer/">http://webaudioapi.com/samples/visualizer/</a></li>
        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import RecorderService from '@/shared/RecorderService'
import utils from '@/shared/Utils'

const SMOOTHING = 0.7
const FFT_SIZE = 2048

export default {
  name: 'Test3',
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  data () {
    return {
      recordingInProgress: false,
      recordings: []
    }
  },
  watch: {},
  created () {
    this.recorderSrvc = new RecorderService()
    this.recorderSrvc.config.createAnalyserNode = true
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
  mounted () {
  },
  methods: {
    startRecording () {
      this.recorderSrvc.startRecording()
        .then(() => {
          this.recordingInProgress = true
          this.analyser = this.recorderSrvc.analyserNode
          this.audioCtx = this.recorderSrvc.audioCtx

          this.analyser.minDecibels = -140
          this.analyser.maxDecibels = 0
          this.freqs = new Uint8Array(this.analyser.frequencyBinCount)
          this.times = new Uint8Array(this.analyser.frequencyBinCount)

          this.canvas = document.querySelector('canvas')
          this.canvasWidth = this.canvas.width
          this.canvasHeight = this.canvas.height

          window.requestAnimationFrame(this.draw.bind(this))
        })
        .catch((error) => {
          console.error('Exception while start recording: ' + error)
          alert('Exception while start recording: ' + error.message)
        })
    },
    stopRecording () {
      this.recordingInProgress = false
      this.recorderSrvc.stopRecording()
    },
    onNewRecording (evt) {
      this.recordings.push(evt.detail.recording)
    },
    draw () {
      this.analyser.smoothingTimeConstant = SMOOTHING
      this.analyser.fftSize = FFT_SIZE

      // Get the frequency data from the currently playing music
      this.analyser.getByteFrequencyData(this.freqs)
      this.analyser.getByteTimeDomainData(this.times)

      // let width = Math.floor(1 / this.freqs.length, 10)

      let canvas = this.canvas
      let drawContext = canvas.getContext('2d')
      let cWidth = this.canvasWidth
      let cHeight = this.canvasHeight

      drawContext.clearRect(0, 0, cWidth, cHeight)

      // Draw the frequency domain chart.

      for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
        let value = this.freqs[i]
        let percent = value / 256
        let height = cHeight * percent
        let offset = cHeight - height - 1
        let barWidth = cWidth / this.analyser.frequencyBinCount
        let hue = i / this.analyser.frequencyBinCount * 360
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)'
        drawContext.fillRect(i * barWidth, offset, barWidth, height)
      }

      // Draw the time domain chart.
      drawContext.fillStyle = 'gray'
      for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
        let value = this.times[i]
        let percent = value / 256
        let height = cHeight * percent
        let offset = cHeight - height - 1
        let barWidth = cWidth / this.analyser.frequencyBinCount
        drawContext.fillRect(i * barWidth, offset, 1, 2)
      }

      if (this.recordingInProgress) {
        window.requestAnimationFrame(this.draw.bind(this))
      }
    },
    getFrequencyValue (freq) {
      let nyquist = this.audioContext.sampleRate / 2
      let index = Math.round(freq / nyquist * this.freqs.length)
      return this.freqs[index]
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
