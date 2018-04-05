<template>
  <v-container>
    <v-layout row wrap>
      <div class="test1">
        <h3>Repeatable Recording &amp; Playback</h3>
        <p>Click start/stop multiple times to create multiple recordings. Works on all modern browser/device
          combinations, including iOS/Safari 11.2.x and newer. However, there are stability problems on iOS/Safari.</p>
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

    <v-layout column wrap class="mt-5">
      <h4>Notes
        <small>(as of iOS 11.2.6)</small>
      </h4>
      <v-divider></v-divider>
      <p>
        There are multiple valid ways to do audio recording and playback on every browser/device combination
        <i>except</i> iOS/Safari. I believe there are four significant issues, and only the first one seems to be well
        known.
      </p>
      <div class="ml-4">
        <ul>
          <li><strong>Security context of the getUserMedia handler is important</strong> - <br>
            <p>
              The most common and widely known issue issue is that the success handler of the getUserMedia is no longer
              in the context of the user click. As a result, any audio context and processors created in the handler
              won't work. The solution is to create the audio context and any processors before calling getUserMedia,
              while still in the user click handler context. Then once getUserMedia provides the stream,
              use the previously created constructs to setup the graph and start recording.
            </p></li>
          <li><strong>Multiple recordings require new audio streams</strong> - <br>
            <p>
              There are a number of demos that work for the first recording on iOS/Safari, that then fail with empty
              audio on subsequent recordings until page is reloaded. The reason is that after stopping recording and
              extracting playable blob, the next recording requires a new AudioStream. This AudioStream can come
              from another call to getUserMedia (which won't prompt user after the first time), or potentially, by
              cloning the existing audio stream.
            </p></li>
          <li><strong>Red recording bar indicator</strong> - <br>
            <p>
              After granting permission to microphone, iOS/Safari will show a red bar notification anytime user switches
              away from the tab where permission was granted. To remove this bar, the recording stream's tracks must be
              stopped after recording is finished. Stopping the tracks (and closing the audio context) is
              straightforward and works well, except for this last issue:
            </p>
          </li>
          <li><strong>A sleep/lock/switch event can easily break things, is not detectable, and is not easily
            recoverable</strong> - <br>
            <p>
              To see this using the demo above, uncomment the four lines in
              <code>RecordingService._onDataAvailable</code> related
              to stopping the track and closing the audio context. With those lines active, when recording is stopped
              the red bar will go away and the microphone icon in the Safari address bar will go away. Then, press
              home key and start the mail app. Then switch back to safari and try to make another recording. Most
              of the time the recording will appear to work, but the audio will be silent. As far as I can tell, there
              is no way to
              detect
              this, and there is no way to recover without loading a new tab or force quitting Safari.
            </p>
            <p><em>If</em> the tracks are not stopped and so the red bar/icon remains, then this occurs much less
              frequently. Of course, that means the red bar is constantly visible though. And, even in this
              scenario, starting another app that uses the microphone will almost always break things again. I have
              not been able to find a way to detect, much less, programmatically fix things, when this occurs. My
              assumption is that the underlying issue is due to low level iOS/Safari bugs, and not in how this code is setting
              things up.</p>
          </li>
        </ul>
      </div>
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
        </ul>
      </div>
    </v-layout>

    <v-layout column wrap>
      <h4 class="mt-3">Source</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/kaliatech/audio-recorder-polyfill">https://github.com/kaliatech/audio-recorder-polyfill</a>
            <ul class="ml-3">
              <li>Primarily: <a href="#">RecorderService.js</a></li>
            </ul>
          </li>
          <li><a href="https://github.com/kaliatech/audio-recorder-polyfill">https://github.com/kaliatech/audio-recorder-polyfill</a>
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
      recordings: []
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
