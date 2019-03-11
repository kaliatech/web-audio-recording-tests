// import 'babel-polyfill'
// import lamejs from 'lamejs'

export default function () {
  // Note that relative paths don't work when loaded as a blob
  // https://stackoverflow.com/questions/22172426/using-importsscripts-within-blob-in-a-karma-environment
  // importScripts('https://localhost:8443/workers/encoders/lame.js') // eslint-disable-line

  let channels = 1 // 1 for mono or 2 for stereo
  // let sampleRate = 44100 // 44.1khz (normal mp3 samplerate)
  let kbps = 128 // encode 128kbps mp3

  let mp3encoder = null

  const maxSamples = 1152

  var mp3Data = [] // array of Uint8Array

  function init (opts) {
    /* global lamejs */
    importScripts(opts.baseUrl + '/workers/encoders/lame.min.js'); // eslint-disable-line
    mp3encoder = new lamejs.Mp3Encoder(channels, opts.sampleRate, kbps)
  }

  function floatTo16BitPCM (input, output) {
    for (var i = 0; i < input.length; i++) {
      var s = Math.max(-1, Math.min(1, input[i]))
      output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF)
    }
  }

  function convertBuffer (arrayBuffer) {
    var data = new Float32Array(arrayBuffer)
    var out = new Int16Array(arrayBuffer.length)
    floatTo16BitPCM(data, out)
    return out
  }

  function encode (arrayBuffer) {
    let samplesMono = convertBuffer(arrayBuffer)
    let remaining = samplesMono.length
    for (let i = 0; remaining >= 0; i += maxSamples) {
      var left = samplesMono.subarray(i, i + maxSamples)
      var data = mp3encoder.encodeBuffer(left)
      mp3Data.push(data)
      remaining -= maxSamples
    }

    // var mp3buf = mp3encoder.encodeBuffer(buffer)
    // if (mp3buf.length > 0) {
    //   mp3Data.push(mp3buf)
    // }
  }

  function dump () {
    var mp3buf = mp3encoder.flush()
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }

    // Probably results in native memory copy
    postMessage(mp3Data)

    // Would like to do this, but not possible because mp3Data is generic array of Uint8Array, and generic
    // arrays are not transferrable types.
    // postMessage(mp3Data, [mp3Data])

    // This might help if/when ever become available again
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer

    // For now, though, we have not other option except to build a complete copy in javascript. This means
    // we temporarily require twice the memory of whatever was recorded.

    mp3Data = []
  }

  onmessage = function (e) {
    if (e.data[0] === 'encode') {
      encode(e.data[1])
    }
    else if (e.data[0] === 'dump') {
      dump(e.data[1])
    }
    else if (e.data[0] === 'init') {
      init(e.data[1])
    }
    else if (e.data[0] === 'close') {
      self.close()
    }
  }
}
