<template>
  <v-container>
    <v-layout row wrap>
      <v-flex md3>
      </v-flex>
      <v-flex md6>
        <div class="text-xs-center home--menu">
          <p>
            Tests to verify functionality of web audio <strong>recording</strong> across all browsers. Particularly on iOS/Safari 11.2.x as it
            is very strict on security context and has <del>bugs</del>
            <em>special features</em>.
          </p>

          <div>
            <v-btn color="info" to="/diagnostics">Browser Diagnostics</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test1">1 - Repeatable Audio Recording</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test2">2 - Processing &amp; Manipulation</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test3">3 - Processors w/ Peak Levels</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test4">4 - Microphone Selection</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test5">5 - Analyser Node</v-btn>
          </div>
          <div>
            <v-btn color="info" to="/test6">6 - Alternate Encoders</v-btn>
          </div>
        </div>
      </v-flex>
      <v-flex md3>
      </v-flex>

    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'Home',
  components: {},
  data () {
    return {}
  }
}
</script>
<style lang="stylus">
  .home--menu
    button, a.btn
      width: 20em

  .home--menu .btn__content
    justify-content: normal
</style>
