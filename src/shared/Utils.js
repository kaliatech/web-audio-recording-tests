export class Utils {
  // https://stackoverflow.com/a/14919494
  humanFileSize (bytes, si) {
    var thresh = si ? 1000 : 1024
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B'
    }
    var units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    var u = -1
    do {
      bytes /= thresh
      ++u
    } while (Math.abs(bytes) >= thresh && u < units.length - 1)
    return bytes.toFixed(1) + ' ' + units[u]
  }

  /**
   * Check user agent for Safari on iOS
   * @returns {boolean}
   */
  isIosSafari () {
    return navigator.userAgent.match(/iP(od|hone|ad)/) &&
      navigator.userAgent.match(/AppleWebKit/) &&
      !navigator.userAgent.match(/(Cr|Fx|OP)iOS/)
  }
}

export default new Utils()
