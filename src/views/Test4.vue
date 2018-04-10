<template>
  <v-container>
    <v-layout row wrap>
      <div class="test3">
        <h3>In-browser encoding</h3>
        <p>Tests to verify it's possible to encode the recording before upload. Particularly important on ios/edge which record to uncompressed WAV format by default.</p>
        <div>
          <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
          </v-btn>
          <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
          <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
        </div>
      </div>
    </v-layout>
    <v-layout row wrap class="ml-1 mt-1">
      <v-checkbox v-model="cleanupWhenFinished"
                  label="Stop tracks and close audio context when recording stopped"></v-checkbox>
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
      <h4 class="mt-3">Relevant</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/zhuker/lamejs">https://github.com/zhuker/lamejs</a></li>
          <li><a href="https://github.com/blixt/js-lameworker">https://github.com/blixt/js-lameworker</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API">https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API</a></li>
          <li><a href="https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/">https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/</a></li>
          <ul>
          <li><a href="https://github.com/MicrosoftEdge/Demos/blob/master/microphone">https://github.com/MicrosoftEdge/Demos/blob/master/microphone</a></li>
          </ul>
        </ul>
      </div>
    </v-layout>

    <v-layout column wrap>
      <h4 class="mt-3">Source</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test4.vue">src/views/Test4.vue</a>
          </li>
        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import recorderSrvc from '@/shared/RecorderServiceTest2'
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
    recorderSrvc.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
    recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
  watch: {
    cleanupWhenFinished (val) {
      recorderSrvc.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
    }
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
