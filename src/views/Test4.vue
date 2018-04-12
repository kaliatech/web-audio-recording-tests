<template>
  <v-container mb-5>
    <v-layout row wrap>

      <div class="test2">
        <h3>Test 4
          <span v-if="$vuetify.breakpoint.xsOnly"><br></span>
          <span v-if="!$vuetify.breakpoint.xsOnly"> - </span>
          Microphone Selection
        </h3>
        <p>Test microphone input selection. See
          <router-link to="/diagnostics">diagnostics</router-link>
          for full enumeration and capabilities. Showing
          microphone labels first requires permissions to an input device. Click eye icon to show microphone labels.
        </p>
      </div>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1">
      <v-flex xs9 md6>
        <v-select
          :items="availableDevices"
          v-model="selectedDevice"
          label="Select Mic"
          single-line
          item-text="name"
          item-value="deviceId"
        >
          <!--          <template slot="item" slot-scope="data">
                      {{data.item.name}}
                    </template>-->
        </v-select>
      </v-flex>
      <v-flex xs1>
        <div class="input-group">
          <v-btn color="primary" flat small @click="enumerateDevicesWithPermission">
            <v-icon>remove_red_eye</v-icon>
          </v-btn>
        </div>

      </v-flex>
    </v-layout>

    <v-layout row wrap class="ml-1 mt-1">
      <div>
        <v-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
        </v-btn>
        <v-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</v-btn>
        <v-icon :class="recordingInProgress ? 'live' : ''">mic</v-icon>
      </div>
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
          <li><a href="https://github.com/kaliatech/web-audio-recording-tests/blob/master/src/views/Test4.vue">src/views/Test4.vue</a>
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
          <li><a href="https://webrtc.github.io/samples/src/content/devices/input-output/">https://webrtc.github.io/samples/src/content/devices/input-output/</a>
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
  name: 'Test3',
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  data () {
    return {
      availableDevices: [],
      enumeratedDevices: [],
      selectedDevice: null,
      recordingInProgress: false,
      recordings: [],
      microphones: []
    }
  },
  watch: {},
  created () {
    this.recorderSrvc = new RecorderService()
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
    this.enumerateDevices()
  },
  mounted () {
  },
  methods: {
    startRecording () {
      this.recorderSrvc.config.userMediaConstraints = {audio: {deviceId: this.selectedDevice.device.deviceId}}
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
    setupAvailDeviceNames () {
      let availDevices = []
      this.enumeratedDevices.forEach((device) => {
        if (device.kind === 'audioinput') {
          if (!device.label) {
            this.enumeratedDevicesPermissionNeeded = true
            availDevices.push({name: 'Audio Input ' + (availDevices.length + 1), device: device})
          }
          else {
            availDevices.push({name: device.label, device: device})
          }
        }
      })
      this.availableDevices = availDevices
    },
    enumerateDevices () {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          this.enumeratedDevices = devices
          this.setupAvailDeviceNames()
          this.selectedDevice = this.availableDevices[0]
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop())
            this.stream = null
          }
        })
        .catch((error) => {
          console.log(error)
          this.enumeratedDevices.push({id: '-', kind: 'error', deviceId: 'error'})
        })
    },
    enumerateDevicesWithPermission () {
      navigator.mediaDevices.getUserMedia({audio: true, deviceId: 'default'})
        .then((stream) => {
          this.enumerateDevices()
          this.stream = stream
        })
        .catch((error) => {
          console.log(error)
        })
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
