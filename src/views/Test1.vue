<template>
  <v-container mb-5>
    <v-layout row wrap>
      <div class="test1">
        <h3>Test 1
          <span v-if="$vuetify.breakpoint.xsOnly"><br></span>
          <span v-if="!$vuetify.breakpoint.xsOnly"> - </span>
          Repeatable Recording &amp; Playback
        </h3>
        <p>Click start/stop multiple times to create multiple recordings. Works on all modern browser/device
          combinations, including iOS/Safari 11.2.x and newer.</p>
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
    <v-layout row wrap class="ml-1 mt-1">
      <v-checkbox v-model="addDynamicsCompressor"
                  label="Add dynamics compressor to audio graph"
                  :disabled="recordingInProgress"></v-checkbox>
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
              away from the tab where permission was granted. To clear this bar, the recording stream's tracks can be
              stopped after recording is finished. This can be tested with the checkbox above. Stopping the tracks and
              closing the audio context is straightforward and works well, except for this last issue (but see updates):
            </p>
          </li>
          <li><strong>
            <del>A sleep/lock/switch event can easily break things, is not detectable, and is not easily
              recoverable
            </del>
          </strong> - <br>
            <del>
              <p>
                To see this, make a recording and verify it plays. Switch to mail app, then back to safari and
                make/verify
                another recording. As long as red bar/microphone is still visible, it generally works. Then, check the
                option to stop tracks and close audio context. Make another recording and verify. Switch to mail app and
                back and try to make another recording. Most of the time the recording will appear to work, but the
                audio
                will be silent. As far as I can tell, there is no way to detect this, and there is no way to recover
                without loading a new tab or force quitting Safari.
              </p>
              <p><em>If</em> the tracks are not stopped and so the red bar/icon remains, then this occurs much less
                frequently. Of course, that means the red bar is constantly visible though. And even then, starting
                another app that uses the microphone will almost always break things again. I have not been able to find
                a
                way to detect, much less, programmatically fix things, when this occurs. My assumption is that the
                underlying issue is due to low level iOS/Safari bugs, and not in how this code is setting things up.</p>
            </del>
          </li>

          <li><strong>Any references not cleaned up after recording complete can affect stability</strong> - <br>
            <p>UPDATED 2018-04-10: After writing the previous section, I rewrote a number of things and removed all
            dependencies. By doing that I was able to ensure that everything gets cleaned up when recording is
            complete. I now no longer have stability issues on iOS, though I don't know exactly what was causing
            it previously. I thought perhaps it was the web worker, which I now close when recording is complete. But
            quick testing shows that even if I don't close the webworker, this new handling seems to be stable after
            sleep/lock/switch events.</p>
          </li>

          <li><strong>Mobile-web-app-capable meta might be causing issues</strong> - <br>
            <p>
            I haven't vetted this 100%, but before 11.3 release I thought the "Add to Home Screen" and launching as a
            full screen web app using apple-mobile-web-app-capable tag worked fine. With 11.3 it no longer works. It
            appears as if navigator.mediaDevices is missing completely when launched in this context. Similarly,
            clicking links from apps like slack appears to launch in to a context without mediaDevices. Possibly related
            <a
              href="https://stackoverflow.com/questions/46228218/how-to-access-camera-on-ios11-home-screen-web-app/46350136">
              link on StackOverflow</a>.</p>
          </li>

        </ul>
      </div>
    </v-layout>

    <v-layout column wrap>
      <h4 class="mt-3">Source</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test1.vue">src/views/Test1.vue</a>
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
        </ul>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
import RecorderService from '@/shared/RecorderService'
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
      micGainSlider: 100,
      micGain: 1.0,
      cleanupWhenFinished: true,
      addDynamicsCompressor: false
    }
  },
  created () {
    this.recorderSrvc = new RecorderService()
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
  watch: {
    cleanupWhenFinished (val) {
      this.recorderSrvc.config.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
    },
    micGainSlider () {
      this.micGain = (this.micGainSlider * 0.01).toFixed(2)
      this.recorderSrvc.setMicGain(this.micGain)
    }
  },
  methods: {
    startRecording () {
      this.recorderSrvc.config.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
      this.recorderSrvc.config.createDynamicsCompressorNode = this.addDynamicsCompressor
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
      this.recorderSrvc.stopRecording()
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
