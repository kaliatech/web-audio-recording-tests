export default function () {
  let channels = 1
  let quality = 0.4

  let oggEncoder = null

  let oggData = []

  function init (opts) {
    /* global OggVorbisEncoder */

    // Possibly required for loading min version, but couldn't get min version to work. Not sure why.
    // self.OggVorbisEncoderConfig = {
    //   memoryInitializerPrefixURL: opts.baseUrl + '/workers/encoders/'
    // }

    // Unable to load min version. Not sure why.  Error in firefox is "The URI is malformed". Guessing related to the .mem.
    importScripts(opts.baseUrl + '/workers/encoders/OggVorbisEncoder.js'); // eslint-disable-line
    oggEncoder = new OggVorbisEncoder(opts.sampleRate, channels, quality)
  }

  function encode (arrayBuffer) {
    var data = oggEncoder.encode([arrayBuffer])
    oggData.push(data)
  }

  function dump () {
    let blob = oggEncoder.finish('audio/ogg')

    // this works, but likely results in native memory copy
    postMessage(blob)

    // Looking at source of OggVorbisEncoder, I think it would be easy to change to allow transferring of the
    // raw buffer instead.

    // this does not work, I presume because blobs aren't transferrable
    // postMessage(blob, [blob])

    oggData = []
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
