<template>
  <v-container mb-5>
    <v-layout row wrap>

      <div class="test2">
        <h3>Test 6
          <span v-if="$vuetify.breakpoint.xsOnly"><br></span>
          <span v-if="!$vuetify.breakpoint.xsOnly"> - </span>
          In-browser Encoding
        </h3>
        <p>Tests to verify encoding capabilities <em>while</em> recording. Note that for this test, the native
          MediaRecorder is disabled even on browsers that have it.</p>
      </div>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1" v-if="!hasMediaRecorder">
      <div>
        <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
        </v-btn>
        <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
        <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
      </div>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1" v-if="hasMediaRecorder">
      <div>
        <v-alert type="error" value="true">
          This test only makes sense on browsers that don't have a native MediaRecorder. It would be possible
          to use a manual encoder on other browsers, but this test isn't written to support it.
        </v-alert>
      </div>
    </v-layout>

    <v-layout row wrap class="mt-1">
      <v-flex xs12>
        <h4 class="mt-3">Select Encoder</h4>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-flex xs9 md6>
          <v-select
            :items="this.encoders"
            v-model="selectedEncoder"
            label="Select Encoder"
            single-line
            item-text="name"
            :disabled="recordingInProgress"
          >
          </v-select>
        </v-flex>
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
                  <audio :src="recording.blobUrl" :type="recording.mimeType" controls="true"/>
                </div>
                <div>
                  <a :href="recording.blobUrl" download>download</a>
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

    <v-layout column wrap class="mt-3">
      <h4 class="mt-3">Notes</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <p>
          This is important mostly for safari/edge or any browser without native MediaRecorder support. Without native
          encoding, most encoding implementations encode the incoming audio stream to uncompressed PCM audio/wav.
          However, this
          significantly limits the duration of the recording due to memory constraints. And if not encoded before
          upload,
          the upload is significantly larger than it would be if using a compressed encoding. Encoding the wav
          data after recording, before uploading, is relatively straightforward. This test is specifically to test
          encoding
          <em>while</em> recording.
        </p>
        <p>
          This test uses web workers to do the encoding. Check out <a
          href="https://higuma.github.io/ogg-vorbis-encoder-js/">this demo</a> for testing encoding with and without
          workers.
        </p>
        <p>
          If using ogg encoder, the resulting recordings will not playback on ios/safari because it doesn't support
          the format natively. Also, I was unable to get the minified version (~800k) of the ogg encoder to work. The
          unminified version currently used in this test is ~2.3MB (or ~400k gzipped).
        </p>

      </div>
    </v-layout>

    <v-layout column wrap class="mt-3">
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
          <li><a href="https://github.com/zhuker/lamejs">https://github.com/zhuker/lamejs</a></li>
          <li><a href="https://github.com/zhuker/lamejs/pull/17">https://github.com/zhuker/lamejs/pull/17</a></li>
          <li><a
            href="https://higuma.github.io/ogg-vorbis-encoder-js/">https://higuma.github.io/ogg-vorbis-encoder-js/</a>
            <ul>
              <li><a
                href="https://github.com/higuma/ogg-vorbis-encoder-js">https://github.com/higuma/ogg-vorbis-encoder-js</a>
              </li>
            </ul>

          </li>

        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import RecorderService from '@/shared/RecorderService'
import utils from '@/shared/Utils'

const encoders = [
  {id: 'wav', name: 'audio/wav - custom - mono'},
  {id: 'mp3', name: 'audio/mpeg - zhuker/lamejs - mono/128kbps'},
  {id: 'ogg', name: 'audio/ogg - higuma/oggjs - mono/~128kps'}
]

export default {
  name: 'Test3',
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  data () {
    return {
      encoders: encoders,
      hasMediaRecorder: window.MediaRecorder || false,
      selectedEncoder: encoders[0],
      recordingInProgress: false,
      recordings: []
    }
  },
  watch: {},
  created () {
    this.recorderSrvc = new RecorderService()

    // Override to force all browsers to use manual encoding
    this.recorderSrvc.config.usingMediaRecorder = false

    this.hasMediaRecorder = this.recorderSrvc.config.usingMediaRecorder
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
  mounted () {
  },
  methods: {
    startRecording () {
      this.recorderSrvc.config.manualEncoderId = this.selectedEncoder.id
      this.recorderSrvc.startRecording()
        .then(() => {
          this.recordingInProgress = true
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
