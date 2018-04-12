<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <h3>Version</h3>
        {{ version }}
      </v-flex>

      <v-flex xs12 class="mt-3">
        <h3>Commit</h3>
        {{ commit }}
      </v-flex>

      <v-flex xs12 class="mt-3">
        <h3>Branch</h3>
        {{ branch }}
      </v-flex>

      <v-flex xs12 class="mt-3">
        <h3>Timestamp</h3>
        {{ timestamp }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      version: typeof WEBPACK_VERSION === 'undefined' ? '-' : WEBPACK_VERSION,
      commit: typeof WEBPACK_COMMITHASH === 'undefined' ? '-' : WEBPACK_COMMITHASH,
      branch: typeof WEBPACK_BRANCH === 'undefined' ? '-' : WEBPACK_BRANCH,
      timestamp: typeof WEBPACK_TIMESTAMP === 'undefined' ? '-' : WEBPACK_TIMESTAMP
    }
  }
}
</script>
