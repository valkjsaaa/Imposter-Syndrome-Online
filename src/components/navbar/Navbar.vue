<template>
  <b-navbar toggleable="lg" class="navbar-default container">
    <b-navbar-brand>
      Imposter Syndrome
      <span v-if="roomCode">: Room {{ roomCode }}</span>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/" @click="reload">Home</b-nav-item>
        <b-nav-item
          v-for="(value, key) in this.$data"
          :key="key"
          v-b-modal="'modal-' + key"
          busy="true"
        >
          {{key}}
          <NavModal :name="key" :arr="value" />
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-text>
          Server Status:
          <span
            :class="{
              'text-success': serverStatus === 'Connected',
              'text-danger': serverStatus === 'Disconnected'}"
          >{{serverStatus}}</span>
        </b-nav-text>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import Home from "@/views/Home.vue";
import NavModal from "@/components/navbar/NavModal.vue";
import { mapState } from "vuex";

export default {
  components: {
    Home,
    NavModal
  },
  data() {
    return {
      About: [
        {
          heading: "",
          html: `<p>
                Impostor Syndrome is a original game created by
                <a href="https://jackieyang.me" target="__blank">Jackie Yang</a>,
                <a href="https://cs.stanford.edu/~glorii/" target="__blank">Gloria Liu</a>, and
                Jean Betterton
                for Stanford Game Design Fundamentals course.
                <br/>
                The website code is partly adopted from <a href="https://github.com/HanaXu/Avalon-Online" target="__blank">Avalon-Online</a>.
                <br/>
                We used graphics by <a href="https://www.freepik.com/vectors/abstract">starline on www.freepik.com</a>, <a href="https://www.pngwave.com">pngwave.com</a>, and <a href="https://imgbin.com">imgbin.com</a>
                </p>
                <p>Development: <a href="https://github.com/valkjsaaa/Imposter-Syndrome-Online" target="__blank">
                https://github.com/valkjsaaa/Imposter-Syndrome-Online <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 16" width="12" height="16"><path fill-rule="evenodd" 
                d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 
                2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg></a></p>`
        }
      ],
      Rules: [
        {
          heading: "Objective",
          html: `<p>6 people are selected to go on a secret scientific mission.
          Within the group, there are 5 scientists and 1 impostor.</p>
          <p>
          <br/>
          Each scientist knows a theory. Three of them are genius scientists and know the correct theory.
          Two of them are imcompetent scientists and have the wrong theory.
          The scientists have to use the correct theory to complete the mission.
          </p>
          <br/>
          The impostor doesn’t know any theory and wants to sabotage the mission or steal the correct theory.
`
        },
        {
          heading: "Game Play",
          html: `In the scientific mission, there are 5 experiments.
          <br/>
          Before each experiment, the members <b>share information</b>.
          <br/>
          Then, some members are <b>nominated</b> to do the experiment.
          <br/>
          Lastly, the nominated members <b>conduct</b> the experiment.
          <br/>
          If 3 out of 5 experiments are successful and the impostor can’t <b>guess</b> the correct theory then the scientists win.
          Otherwise, the impostor wins.
`
        },
        {
          heading: "Information Sharing - 2 minutes",
          html: `<p>Each member takes a turn sharing one word that they believe describes the correct theory. Afterwards, members discuss the shared words and the results of previous experiments.
          </p>
          <br/>
          <i>Scientist Suggestion</i>: You want to figure out the correct theory without letting the impostor figure it out also.
          <br/>
          <i>Impostor Suggestion</i>: You want to blend in as a scientist and maybe give misleading info.
`
        },
        {
          heading: "Nomination process - 1 minute",
          html: `<p>Numbers of scientists to nominate for each round: 2, 3, 2, 3, 3
          </p><br/>
          <p>Starting from the first player, the selected player is the team leader on this experiment.
          The team leader can select a number of people to be on the team of this experiment. After expressing their opinion on the team selection in order, they vote on the selection. If the majority of players agree, the team proceeds and does the experiment. Otherwise, the next player becomes the team leader and proposes a new team.
          </p>
          <br/>
          <i>Scientist Suggestion</i>: You want to nominate scientists that will all answer correctly.
          <br/>
          <i>Impostor Suggestion</i>: You want to nominate at least one scientist that will answer incorrectly or get nominated yourself. `
        },
        {
          heading: "Experiment process - 30 seconds",
          html: `<p>The AI will ask binary questions about the theory to those who are nominated. An experiment is successful only if all of the answers are correct. In the end, the AI will announce the experimental result (success/failure) and how many incorrect answers there are.
          </p><br/>
          <i>Scientist Suggestion</i>: You want to answer the question correctly. Keep in mind that your theory may be incorrect.
          <br/>
          <i>Impostor Suggestion</i>: You want to answer the question incorrectly (or answer correctly to gain trust for future sabotages).
          `
        },
        {
          heading: "Guessing process - 1 minute",
          html: `In order to hide the correct theory, each scientist comes up with a “fake theory” and saves it to the computer.
          At the end of the mission, the impostor accesses the computer and can see the 4 fake theories and the 1 real theory.
          If the impostor figures out which one is correct, the imposter wins.`
        }
      ]
    };
  },
  computed: mapState(["roomCode", "serverStatus"]),
  methods: {
    reload() {
      window.location.reload();
    }
  }
};
</script>