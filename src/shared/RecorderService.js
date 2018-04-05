import utils from '@/shared/Utils'

class RecorderService {
  constructor () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext

    // Use psuedo polyfill when needed (Edge and Safari)
    if (!window.MediaRecorder) {
      window.MediaRecorder = require('audio-recorder-polyfill-kaliatech')
    }

    this.em = document.createDocumentFragment()
  }

  startRecording () {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext()
    }

    // On iOS safari, must create the processor in the user click ctx before the getUserMedia
    if (utils.isIosSafari()) {
      this.processor = this.audioCtx.createScriptProcessor(2048, 1, 1)
    }

    // This will prompt user for permission if needed
    const mediaConstraints = {
      audio: true
    }
    return navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then((stream) => {
        this._startRecordingWithStream(stream)
      })
  }

  _startRecordingWithStream (stream) {
    this.micAudioStream = stream

    this.mediaRecorder = new MediaRecorder(this.micAudioStream)
    this.mediaRecorder.addEventListener('dataavailable', (evt) => this._onDataAvailable(evt))
    this.mediaRecorder.addEventListener('error', (evt) => this._onError(evt))

    // On iOS/Safari, we must pass in an audioCtx and scriptProcessor that were created in the user click ctx
    if (utils.isIosSafari()) {
      this.mediaRecorder.start(null, this.audioCtx, this.processor)
    }
    else {
      this.mediaRecorder.start()
    }
  }

  _onDataAvailable (evt) {
    // Single blob at end for now, though this limits length of recording
    if (this.mediaRecorder.state === 'inactive') {
      let blobUrl = URL.createObjectURL(evt.data)
      const recording = {
        ts: new Date().getTime(),
        blobUrl: blobUrl,
        mimeType: evt.data.type,
        size: evt.data.size
      }

      if (this.processor) {
        this.processor.disconnect()
        this.processor = null
      }

      if (this.mediaRecorder.destroy) {
        this.mediaRecorder.destroy()
      }

      // This removes the red bar in iOS/Safari. This works correctly in all cases _except_ that if iOS
      // sleep/lock/switch occurs, then often subsequent recordings will be empty until new tab is loaded. If track
      // is not stopped, then things usually still work after sleep/lock/switch, but the red bar never goes away.

      // this.micAudioStream.getTracks().forEach((track) => track.stop())
      // this.micAudioStream = null
      //
      // this.audioCtx.close()
      // this.audioCtx = null

      this.em.dispatchEvent(new CustomEvent('recording', {detail: {recording: recording}}))
    }
  }

  _onError (evt) {
    console.log('error', evt)
    this.em.dispatchEvent(new Event('error'))
    alert('error:' + evt) // for debugging purposes
  }

  stopRecording () {
    this.mediaRecorder.stop()
  }
}

export default new RecorderService()
