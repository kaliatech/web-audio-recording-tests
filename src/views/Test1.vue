<template>
  <v-container>
    <v-layout row wrap>
      <div class="test1">
        <h3>Test 1 - Repeatable Recording &amp; Playback</h3>

        <div>

          <v-btn @click="startRecording" v-if="!permissionGranted" :disabled="recordingInProgress">Request Permission
          </v-btn>
          <v-btn @click="startRecording" v-if="permissionGranted" :disabled="recordingInProgress">Start Recording
          </v-btn>
          <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
          <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>

        </div>
      </div>
    </v-layout>
    <v-layout column wrap>
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
  </v-container>
</template>

<script>
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
      permissionGranted: !utils.isIosSafari()
    }
  },
  created () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext

    if (!window.MediaRecorder) {
      window.MediaRecorder = require('audio-recorder-polyfill-kaliatech')
      window.MediaRecorder.isPolyfill = true
    }
  },
  methods: {
    startRecording () {
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext()
      }

      if (!this.micAudioStream) {
        this.createMicAudioStream()
        return
      }

      try {
        // Real MediaRecorder can take options
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder
        const mediaRecorderOpts = {
          // mimeType: 'audio/webm'
        }
        this.mediaRecorder = new MediaRecorder(this.micAudioStream, mediaRecorderOpts)
        this.mediaRecorder.addEventListener('dataavailable', (evt) => {
          console.log('dataavailable', evt)

          // let copy = new Blob([evt.data], {type: evt.data.type})
          // let blobUrl = URL.createObjectURL(copy)
          let blobUrl = URL.createObjectURL(evt.data)

          var reader = new FileReader()
          reader.addEventListener('loadend', () => {
            if (this.mediaRecorder.state === 'inactive') {
              this.recordings.push({
                ts: new Date().getTime(),
                blobUrl: blobUrl,
                mimeType: evt.data.type,
                size: evt.data.size
              })

              // This removes the red bar _and_ permission grant in iOS/Safari.
              // this.micAudioStream.getTracks().forEach((track) => track.stop())
              // this.micAudioStream = null
              // this.permissionGranted = false // necessary to have the full interaction again on iOS/Safari

              // If we don't shut things down and want to make subsequent recordings on iOS/Safari, then we need to
              // clone the stream. Reusing existing stream results in empty audio. We could also get new stream
              // from getUserMedia again here instead of cloning. We have to do it here though (within user click event
              // context) because otherwise we have no way to start recording again without another click.
              this.micAudioStream = this.micAudioStream.clone()

              this.audioCtx.close()
              this.audioCtx = null
            }
            console.log('state', this.mediaRecorder.state)
          })
          // reader.readAsDataURL(evt.data)
          reader.readAsArrayBuffer(evt.data)
        })
        this.mediaRecorder.addEventListener('error', (evt) => {
          console.log('error', evt)
          alert('Error from MediaRecorder: ' + evt)
        })

        // For now, recording in to a single global blob. In upcoming tests:
        //   https://stackoverflow.com/questions/40363335/how-to-create-an-audiobuffer-from-a-blob
        // if (this.mediaRecorder.isPolyfill) {
        //   this.mediaRecorder.start(null, this.audioCtx)
        // }
        // else {
        this.mediaRecorder.start()
        // }

        console.log('state', this.mediaRecorder.state)
        this.recordingInProgress = true
      }
      catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e)
        alert('Exception while creating MediaRecorder: ' + e)
      }
    },
    stopRecording () {
      this.mediaRecorder.stop()
      this.recordingInProgress = false
    },
    createMicAudioStream () {
      const mediaConstraints = {
        audio: true
      }

      navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream) => {
          this.micAudioStream = stream
          // In iOS, the promise is not within the security context, and
          // and so this fails. Subsequent recordings don't require new stream as long
          // as audio tracks aren't closed and the existing stream is cloned before new recording.
          if (!utils.isIosSafari()) {
            this.startRecording()
          }
          this.permissionGranted = true
        })
        .catch((error) => {
          alert('Error with getUserMedia: ' + error.message)
          console.log('Error with getUserMedia:', error)
        })
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
