<template>
  <div class="mb-3">
    <v-layout row>
      <h2>Browser Diagnostics</h2>
    </v-layout>

    <v-layout row class="mt-3 mb-3">
      <h4>Web Audio Recording Support</h4>
    </v-layout>
    <v-layout row wrap class="ml-4">
      <v-flex xs12>
        <ul>
          <li><span class="lbl">AudioContext</span> : <span class="val">{{ audioContextStr }}</span></li>
          <li><span class="lbl">webkitAudioContext</span> : <span class="val">{{ webkitAudioContextStr }}</span></li>
          <li><span class="lbl">mediaDevices</span> : <span class="val">{{ mediaDevicesStr }}</span></li>
          <li><span class="lbl">getUserMedia</span> : <span class="val">{{ getUserMediaStr }}</span></li>
          <li><span class="lbl">MediaRecorder</span> : <span class="val">{{ mediaRecorderOrigStr }}</span></li>
          <li><span class="lbl">AnalyserNode</span> : <span class="val">{{ analyserNode }}</span></li>
          <li><span class="lbl">DynamicsCompressorNode</span> : <span class="val">{{ dynamicsCompressorNode }}</span>
          </li>
        </ul>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>Audio Input Devices</h4>
    </v-layout>
    <v-layout row wrap class="ml-4">
      <v-flex sm6 v-for="name in availableDeviceNames" v-bind:key="name">
        <div class="pr-3">
          <ul>
            <li>{{name}}</li>
          </ul>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="ml-4" v-if="enumeratedDevicesPermissionNeeded">
      <v-btn @click="requestDevicePermissions">Request Default Device Permission</v-btn>
    </v-layout>
    <v-layout row wrap class="ml-5" v-if="enumeratedDevicesPermissionNeeded">
      Needed to get device labels
    </v-layout>
    <v-layout row wrap class="ml-4" v-if="enumeratedDevicesPermissionRevokable">
      <v-btn @click="revokeDevicePermissions">Revoke Default Device Permission</v-btn>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>Supported Device Constraints</h4>
    </v-layout>
    <v-layout row wrap class="ml-4">
      <span v-for="deviceConstraint in supportedDeviceConstraints" v-bind:key="deviceConstraint" class="lbl">{{ deviceConstraint }}</span>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>Default Capabilities, Constraints, & Settings</h4>
    </v-layout>
    <v-layout row wrap class="ml-4">
      <v-flex sm12 v-for="detail in defaultDeviceDetails" v-bind:key="detail.name">

        <ul>
          <li>
            <span class="lbl-1">{{ detail.name }}</span> : <span class="val">{{ detail.text}}</span>
          </li>
        </ul>

      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <h4>Supported MediaRecorder Mime Types</h4>
    </v-layout>
    <v-layout row wrap class="ml-4">
      <v-flex xs12>
        <ul>
          <li v-for="mimetype in supportedMimeTypes" v-bind:key="mimetype.name">
            <span class="lbl">{{ mimetype.name }}</span> : <span class="val">{{ mimetype.supported }}</span>
          </li>
        </ul>
      </v-flex>
    </v-layout>

    <v-layout column wrap hidden-xs-only mt-3>
      <h4>References</h4>
      <v-divider></v-divider>
      <div class="ml-4">
        <ul>
          <li><a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API">https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints">https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API">https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices">https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API">https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API</a>
          </li>
          <li><a href="https://www.w3.org/TR/webaudio/">https://www.w3.org/TR/webaudio/</a></li>
        </ul>
        <br>
        <ul>
          <li><a href="https://webrtc.github.io/samples/">https://webrtc.github.io/samples/</a></li>
          <li><a href="https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/">https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/microphone/</a>
          </li>
        </ul>
      </div>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Diagnostics',
  data () {
    return {
      availableDeviceNames: [],
      defaultDeviceDetails: [],
      enumeratedDevices: [],
      enumeratedDevicesPermissionNeeded: false,
      enumeratedDevicesPermissionRevokable: false,
      getUserMediaStr: (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? true : false, // eslint-disable-line
      mediaDevicesStr: navigator.mediaDevices ? true : false, // eslint-disable-line
      supportedMimeTypes: [],
      mediaRecorderOrigStr: navigator.MediaRecorder || false,
      supportedDeviceConstraints: []
    }
  },
  computed: {
    audioContextStr () {
      return window.AudioContext ? true : false // eslint-disable-line
    },
    analyserNode () {
      return window.AnalyserNode ? true : false  // eslint-disable-line
    },
    dynamicsCompressorNode () {
      return window.DynamicsCompressorNode ?  true : false // eslint-disable-line
    },
    webkitAudioContextStr () {
      return window.webkitAudioContext ? true : false // eslint-disable-line
    }
  },
  mounted () {
    this.requestDevicePermissions()
  },
  destroyed () {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
  },
  created () {
    const types = [
      'audio/aac',
      'audio/mp4',
      'audio/mpeg',
      'audio/vorbis',
      'audio/wav',
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/wav',
      'audio/x-wav',
      'audio/vnd.wav',

      'video/quicktime',
      'video/webm',
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9',
      'video/webm;codecs=h264',
      'video/mp4']

    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
      this.supportedMimeTypes.push({name: 'none', supported: '(manual encoding required)'})
    }
    else {
      for (const i in types) {
        if (MediaRecorder.isTypeSupported(types[i])) {
          this.supportedMimeTypes.push({name: types[i], supported: MediaRecorder.isTypeSupported(types[i])})
        }
      }
    }

    // Listed without labels until permission is granted to at least one device
    this.enumerateDevices()

    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints()
    for (let constraint in supportedConstraints) {
      if (supportedConstraints.hasOwnProperty(constraint) && supportedConstraints[constraint] === true) {
        this.supportedDeviceConstraints.push(constraint)
      }
    }
  },
  methods: {
    setupAvailDeviceNames () {
      let availDevices = []
      this.enumeratedDevices.forEach((device, idx) => {
        // console.log(device)
        if (device.kind === 'audioinput') {
          if (!device.label) {
            this.enumeratedDevicesPermissionNeeded = true
            availDevices.push('Input ' + idx + ' (' + device.deviceId + ')')
          }
          else {
            availDevices.push(device.label)
          }
        }
      })
      this.availableDeviceNames = availDevices
    },
    enumerateDevices () {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          this.enumeratedDevices = devices
          this.setupAvailDeviceNames()
        })
        .catch((error) => {
          console.log(error)
          this.enumeratedDevices.push({id: '-', kind: 'error', deviceId: 'error'})
        })
    },
    requestDevicePermissions () {
      // this.enumeratedDevices.forEach((device) => {
      // })
      navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
          console.log('stream', stream)

          this.enumerateDevices()
          this.enumeratedDevicesPermissionNeeded = false
          this.enumeratedDevicesPermissionRevokable = true
          this.stream = stream

          this.defaultDeviceDetails = []
          let d = this.defaultDeviceDetails

          let tracks = stream.getAudioTracks()
          console.log('tracks', tracks)
          tracks.forEach((track, trackIdx) => {
            let th = 'track[' + trackIdx + '].'
            d.push({name: th + 'label', text: track.label})
            d.push({name: th + 'kind', text: track.kind})
            d.push({name: th + 'muted', text: track.muted})

            let constraints = track.getConstraints()
            console.log('constraints', constraints)
            for (let key in constraints) {
              d.push({name: th + 'constr[' + key + ']', text: constraints[key]})
            }

            let capabilities = track.getCapabilities()
            console.log('capabilities', capabilities)
            for (let key in capabilities) {
              d.push({name: th + 'capab[' + key + ']', text: capabilities[key]})
            }

            let settings = track.getSettings()
            console.log('settings', settings)
            for (let key in settings) {
              d.push({name: th + 'settings[' + key + ']', text: settings[key]})
            }
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    revokeDevicePermissions () {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop())
        this.stream = null
      }
      this.enumeratedDevicesPermissionNeeded = true
      this.enumeratedDevicesPermissionRevokable = false
      this.enumerateDevices()
    }
  }
}
</script>

<style scoped>
  .lbl {
    display: inline-block;
    width: 15em;
  }

  .lbl-1 {
    display: inline-block;
    width: 15em;
  }

  .val {
    margin-left: 1em;
  }
</style>
