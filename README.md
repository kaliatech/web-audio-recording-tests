# Web Audio Recording Tests

## UPDATE 2021-01!!!
As of 14.3, iOS seems to have finally enabled the native MediaRecorder.  All tests in this site use feature detection of MediaRecorder, and so continue to work, but now use MediaRecorder on iOS.  This makes many of the notes and code here less relevant unless needing to support older browsers that don't have a MediaRecorder.
 
 ### More Info
 * https://webkit.org/blog/11353/mediarecorder-api/
 * https://caniuse.com/mediarecorder
 * https://blog.addpipe.com/safari-technology-preview-73-adds-limited-mediastream-recorder-api-support/

<br/>

----

## Overview
Tests of web audio API recording that work across all browsers, including iOS/Safari 11.2.x and newer.
* https://kaliatech.github.io/web-audio-recording-tests/dist/index.html

This was built as a single page application using vue and webpack, and it includes a number of advanced components 
that are not important for doing basic stable recording. A simpler version, using plain javascript only, is available 
here:
* https://github.com/kaliatech/web-audio-recording-tests-simpler

### Screenshot<br>
![Screenshot](docs/scrshot-test1b.png?raw=true)
