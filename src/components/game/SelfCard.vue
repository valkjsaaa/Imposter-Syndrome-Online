<template>
  <div
      class="self-card row justify-content-md-center py-2"
      :class="{
          evil: selfPlayer.team === 'Evil',
          good: selfPlayer.team === 'Good',
          disconnected: selfPlayer.disconnected === true}"
  >
    <h5 v-if="selfPlayer.team === 'Good'" class="user-word">
      "{{selfPlayer.word}}"
    </h5>
    <img v-if="selfPlayer.team === 'Good'" src="../../assets/scientist.svg" width="189px"/>
    <img v-if="selfPlayer.team === 'Evil'" src="../../assets/imposter.svg" width="189px"/>


  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  computed: mapState({
    playerName: 'playerName',
    players: 'players',
    selfPlayer: state => state.players.find(player => player.name === state.playerName )
  }),
}
</script>

<style scoped>
.self-card {
  width: 189px;
  height: 252px;
}

.self-card img {
  position: absolute;
}

.self-card .user-word {
  color: #FF9A00;
  z-index: 100;
}

.self-card h5 {
  margin-top: 115%;
}
</style>