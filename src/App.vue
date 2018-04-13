<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer
        fixed
        v-model="drawer"
        temporary
        app>
        <v-list dense>
          <v-list-tile to="/">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/diagnostics">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Diagnostics</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/test1">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>1 - Repeatable Audio Recording</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

           <v-list-tile to="/test2">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>2 - Processing &amp; Manipulation</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/test3">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>3 - Processors w/ Peak Levels</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/test4">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>4 - Microphone Selection</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/test5">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>5 - Analyser Node</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/test6">
            <v-list-tile-action>
              <v-icon>mic</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>6 - Alternate Encoders</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile href="https://github.com/kaliatech/web-audio-recording-tests">
            <v-list-tile-action>
              <v-icon>code</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>View on Github</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/version">
            <v-list-tile-action>
              <v-icon>error_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Build Version</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>
      <v-toolbar color="grey" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Web Audio Recording Tests</v-toolbar-title>
        <v-spacer></v-spacer>
        <a href="https://github.com/kaliatech/web-audio-recording-tests">
        <v-icon large>code</v-icon>
        </a>
      </v-toolbar>
      <v-content>
        <v-container fluid class="scroll-container">
          <div mb-5>
            <router-view></router-view>
          </div>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Test1 from './views/Test1.vue'

export default {
  name: 'app',
  components: {
    Test1
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style lang="styl">\
@import './styles/app.styl';
</style>
