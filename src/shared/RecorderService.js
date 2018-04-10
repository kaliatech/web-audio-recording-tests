import encoder, {MimeType as encoderMimeType} from './wave-encoder'

class RecorderService {
  constructor () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext

    this.em = document.createDocumentFragment()
    this.stopTracksAndCloseCtxWhenFinished = true

    this.state = 'inactive'

    this.chunks = []
    this.chunkType = ''

    this.usingMediaRecorder = window.MediaRecorder || false
  }

  createWorker (fn) {
    var js = fn
      .toString()
      .replace(/^function\s*\(\)\s*{/, '')
      .replace(/}$/, '')
    var blob = new Blob([js])
    return new Worker(URL.createObjectURL(blob))
  }

  startRecording (timeslice, forceScriptProcessor = false) {
    if (this.state !== 'inactive') {
      return
    }

    this.audioCtx = new AudioContext()
    this.micGainNode = this.audioCtx.createGain()
    this.outputGainNode = this.audioCtx.createGain()

    // If not using MediaRecorder(i.e. safari and edge), then a script processor is required. It's optional
    // on browsers using MediaRecorder and is only useful if wanting to do custom analysis or manipulation of
    // recorded audio data.
    if (forceScriptProcessor || !this.usingMediaRecorder) {
      this.processorNode = this.audioCtx.createScriptProcessor(2048, 1, 1) // TODO: Get the number of channels from mic
    }

    // Create stream destination on chrome/firefox because, AFAICT, we have no other way of feeding audio graph output
    // in to MediaRecorderSafari/Edge don't have this method as of 2018-04.
    if (this.audioCtx.createMediaStreamDestination) {
      this.destinationNode = this.audioCtx.createMediaStreamDestination()
    }
    else {
      this.destinationNode = this.audioCtx.destination
    }

    // Create web worker for doing the encoding
    if (!this.usingMediaRecorder) {
      this.encoderWorker = this.createWorker(encoder)
      this.encoderWorker.addEventListener('message', (e) => {
        let event = new Event('dataavailable')
        event.data = new Blob([e.data], {type: encoderMimeType})
        this._onDataAvailable(event)
      })
    }

    // This will prompt user for permission if needed
    const mediaConstraints = {
      audio: true
    }
    return navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then((stream) => {
        this._startRecordingWithStream(stream, timeslice)
      })
  }

  _startRecordingWithStream (stream, timeslice) {
    this.micAudioStream = stream

    this.inputStreamNode = this.audioCtx.createMediaStreamSource(this.micAudioStream)
    this.audioCtx = this.inputStreamNode.context

    if (this.processorNode) {
      this.processorNode.onaudioprocess = (e) => this._onAudioProcess(e)
    }

    this.micGainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime)

    this.inputStreamNode.connect(this.micGainNode)

    this.state = 'recording'

    if (this.processorNode) {
      this.micGainNode.connect(this.processorNode)
      this.processorNode.connect(this.outputGainNode)
      this.outputGainNode.connect(this.destinationNode)
    }
    else {
      this.micGainNode.connect(this.outputGainNode)
      this.outputGainNode.connect(this.destinationNode)
    }

    if (this.usingMediaRecorder) {
      this.mediaRecorder = new MediaRecorder(this.destinationNode.stream)
      this.mediaRecorder.addEventListener('dataavailable', (evt) => this._onDataAvailable(evt))
      this.mediaRecorder.addEventListener('error', (evt) => this._onError(evt))

      this.mediaRecorder.start(timeslice)
    }
    else {
      // Output gain to zero to prevent feedback. Seems to matter only on Edge, though seems like should matter
      // on iOS too.  Matters on chrome when connecting graph to directly to audioCtx.destination, but we are
      // not able to do that when using MediaRecorder.
      this.outputGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
      // this.outputGainNode.gain.value = 0

      // Todo: Note that time slicing with manual wav encoder won't work. To allow it would require rewriting the encoder
      // to assemble all chunks at end instead of adding header to each chunk.
      if (timeslice) {
        console.log('Time slicing without MediaRecorder is not yet supported. The resulting recording will not be playable.')
        this.slicing = setInterval(function () {
          if (this.state === 'recording') {
            this.encoderWorker.postMessage(['dump', this.context.sampleRate])
          }
        }, timeslice)
      }
    }
  }

  _onAudioProcess (e) {
    // console.log('onaudioprocess', e)
    // let inputBuffer = e.inputBuffer
    // let outputBuffer = e.outputBuffer

    // TODO: To make this a reusable class, we might emit an event here so any listeners could
    // could receive, and possibly manipulate, onaudioprocess data.
    // this.onAudioEm.dispatch(new Event('onaudioprocess', {inputBuffer:inputBuffer,outputBuffer:outputBuffer}))

    // Example handling:
    // // Each channel (usually only one)
    // for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    //   let inputData = inputBuffer.getChannelData(channel)
    //   let outputData = outputBuffer.getChannelData(channel)
    //
    //   // Each sample
    //   for (let sample = 0; sample < inputBuffer.length; sample++) {
    //     // Make output equal to the same as the input (thus processor is doing nothing at this time)
    //     outputData[sample] = inputData[sample]
    //   }
    // }

    // When manually encoding (safari/edge), there's no reason to copy data to output buffer.  We set the output
    // gain to 0 anyways (which is required on Edge if we did copy data to output). However, if using a MediaRecorder
    // and a processor (all other browsers), then it would be required to copy the data otherwise the graph would
    // generate no data for the MediaRecorder to consume.
    // if (this.forceScriptProcessor) {
    // Copy input to output
    // for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    //   outputBuffer.copyToChannel(inputBuffer.getChannelData(channel), channel)
    // }
    // }

    // Safari and Edge require manual encoding via web worker. Single channel only for now.
    // Example stereo encoder: https://github.com/MicrosoftEdge/Demos/blob/master/microphone/scripts/recorderworker.js
    if (!this.usingMediaRecorder) {
      if (this.state === 'recording') {
        this.encoderWorker.postMessage([
          'encode', e.inputBuffer.getChannelData(0)
        ])
      }
    }
  }

  stopRecording () {
    if (this.state === 'inactive') {
      return
    }
    if (this.usingMediaRecorder) {
      this.state = 'inactive'
      this.mediaRecorder.stop()
    }
    else {
      this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate])
      clearInterval(this.slicing)

      // TODO: There should be a more robust way to handle this
      // Without this, the last recorded sample might be lost due to timing
      setTimeout(() => {
        this.state = 'inactive'
        this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate])
      }, 100)
    }
  }

  _onDataAvailable (evt) {
    // console.log('state', this.mediaRecorder.state)
    // console.log('evt.data', evt.data)

    this.chunks.push(evt.data)
    this.chunkType = evt.data.type

    if (this.state !== 'inactive') {
      return
    }

    let blob = new Blob(this.chunks, {'type': this.chunkType})
    let blobUrl = URL.createObjectURL(blob)
    const recording = {
      ts: new Date().getTime(),
      blobUrl: blobUrl,
      mimeType: blob.type,
      size: blob.size
    }

    this.chunks = []
    this.chunkType = null

    if (this.destinationNode) {
      this.destinationNode.disconnect()
      this.destinationNode = null
    }
    if (this.outputGainNode) {
      this.outputGainNode.disconnect()
      this.outputGainNode = null
    }
    if (this.processorNode) {
      this.processorNode.disconnect()
      this.processorNode = null
    }
    if (this.encoderWorker) {
      this.encoderWorker.postMessage(['close'])
      this.encoderWorker = null
    }
    if (this.micGainNode) {
      this.micGainNode.disconnect()
      this.micGainNode = null
    }
    if (this.inputStreamNode) {
      this.inputStreamNode.disconnect()
      this.inputStreamNode = null
    }

    if (this.stopTracksAndCloseCtxWhenFinished) {
      // This removes the red bar in iOS/Safari
      this.micAudioStream.getTracks().forEach((track) => track.stop())
      this.micAudioStream = null

      this.audioCtx.close()
      this.audioCtx = null
    }

    this.em.dispatchEvent(new CustomEvent('recording', {detail: {recording: recording}}))
  }

  _onError (evt) {
    console.log('error', evt)
    this.em.dispatchEvent(new Event('error'))
    alert('error:' + evt) // for debugging purposes
  }
}

export default new RecorderService()
