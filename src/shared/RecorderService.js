
// const isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)
// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

class WebAudioService {
  constructor () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
  }

  // returns promise
  checkSupportAndRequestPermission () {
    // RT-3600 - Uncommenting this will result in silent audio on ios/safari, after the first recording,
    // until page is reloaded. iOS seemingly requires new audiostream for each getUserMedia.
    // if (this.audioStream) {
    //   return Promise.resolve(true)
    // }

    let mediaConstraints = {
      audio: true
    }

    return navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then((stream) => {
        this.audioStream = stream
        return Promise.resolve(true)
      })
      .catch((error) => {
        console.log('Error with getUserMedia:', error)
        return Promise.reject(error)
      })
  }

  addListenerStateChange (cb) {
    this.stateChangeCallbacks.push(cb)
  }

  _onStateChange (state) {
    // console.log('_onStateChange', state) // recording, paused, stopped or inactive
    if (state === 'recording') {
      this.lastStartTime = new Date()
    }
    else {
      this._appendElapsedDurationAndReset()
    }

    this.stateChangeCallbacks.forEach(it => it(state))
  }

  // Note that this might never return if user does not accept or decline the prompt.
  startRecording () {
    const options = {
      disableLogs: false, // false seems to be the default. Useful to leave logging on for now.
      type: 'audio'
    }
    this.recordRTC = RecordRTC(this.audioStream, options)
    this.recordRTC.onStateChanged = (state) => this._onStateChange(state)

    // Using init is probably not required for just audio, but seems safer
    // However, even though docs show this, it causes stackoverflow
    // this.recordRTC.initRecorder(() => {

    this.resetRecording()
    this.recordRTC.startRecording()
  }

  pauseRecording () {
    this.recordRTC.pauseRecording()
  }

  resumeRecording () {
    this.recordRTC.resumeRecording()
  }

  stopRecording (callback) {
    if (!this.recordRTC) {
      return
    }

    // Don't call stop if already stopped. Doing so seems to result in no stop callback.
    if (this.recordRTC.state && this.recordRTC.state === 'stopped') {
      if (typeof callback === 'function') {
        callback()
      }
      return
    }

    this.recordRTC.stopRecording((audioURL) => {
      this.recordedAudioUrl = audioURL
      this.recordedBlob = this.recordRTC.getBlob()
      if (typeof callback === 'function') {
        callback()
      }

      // This clears the red bar in ios when switching to other apps
      if (this.audioStream && this.audioStream.getAudioTracks().length > 0) {
        this.audioStream.getTracks()[0].stop()
      }

      // and/or
      // audio.src = audioURL
      // and/or (but this generates security warning in Edge and a security block)
      // this.recordRTC.getDataURL(function (dataURL) {
      //   // console.log('dataURL', dataURL)
      // })
    })
  }

  resetRecording () {
    if (!this.recordRTC) {
      return
    }

    // Not sure if this is necessary or safe. It should never be triggered in normal flow.
    if (this.recordRTC.state !== 'inactive') {
      this.recordRTC.clearRecordedData()
    }

    this.recordedDurationMs = 0
    this.lastStartTime = null
  }

  _appendElapsedDurationAndReset () {
    if (!this.lastStartTime) {
      return
    }
    this.recordedDurationMs = this.recordedDurationMs + (new Date().getTime() - this.lastStartTime.getTime())
    this.lastStartTime = null
  }
}

export default new RecorderService()
