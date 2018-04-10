<template>
  <v-container>
    <v-layout row wrap>
      <div class="test2">
        <h3>Recording with Audio Process Events</h3>
        <p>Test to verify it's possible record while simultaneously processing data.</p>
        <div>
          <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
          </v-btn>
          <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
          <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
        </div>
      </div>
    </v-layout>

    <v-layout column wrap v-if="recordings.length > 0">
      <h4 class="mt-3">Recordings</h4>
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
      <span id="">..</span>
    </v-layout>

    <v-layout column wrap>
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
        </ul>
      </div>
    </v-layout>

    <v-layout column wrap>
      <h4 class="mt-3">Source</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test2.vue">src/views/Test2.vue</a>
            <ul class="ml-3">
              <li>Primarily: <a
                href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/shared/RecorderService.js">src/shared/RecorderService.js</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import recorderSrvc from '@/shared/RecorderService'
import utils from '@/shared/Utils'

export default {
  name: 'Test1',
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  data () {
    return {
      recordingInProgress: false,
      supportedMimeTypes: [],
      recordings: [],
      cleanupWhenFinished: true
    }
  },
  created () {
    recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
  methods: {
    startRecording () {
      recorderSrvc.startRecording()
        .then(() => {
          this.recordingInProgress = true
        })
        .catch((error) => {
          console.error('Exception while start recording: ' + error)
          alert('Exception while start recording: ' + error.message)
        })
    },
    stopRecording () {
      recorderSrvc.stopRecording()
      this.recordingInProgress = false
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
