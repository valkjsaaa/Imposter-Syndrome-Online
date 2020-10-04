import { objectToArray, shuffle, populateRoleList } from './utility.mjs';
import Player from './player.mjs';
import Quest from './quest.mjs';

export const GoodTeam = new Set(['Merlin', 'Loyal Servant of Arthur', 'Percival']);

// defines what type of character roles for size of game
// key: number of players
// value: object of game roles and how many
const BaseRoles = {
  5: {
    'GoodTrue': 3,
    'GoodFalse': 1,
    'Evil': 1
  },
  6: {
    'GoodTrue': 3,
    'GoodFalse': 2,
    'Evil': 1
  },
  7: {
    'GoodTrue': 4,
    'GoodFalse': 1,
    'Evil': 2
  },
  8: {
    'GoodTrue': 4,
    'GoodFalse': 2,
    'Evil': 2
  },
  9: {
    'GoodTrue': 5,
    'GoodFalse': 2,
    'Evil': 2
  },
  10: {
    'GoodTrue': 5,
    'GoodFalse': 3,
    'Evil': 2
  }
};

const Dictionary = [
  {
    'WordPair': ['Tofu', 'Steak'],
    'Questions': [
        'Is it usually white?',
        'Is it usually oily/fatty?',
        'Is it usually used with butter?',
        'Is it usually used in Asian food?',
        'Is it animal product?',
    ],
    "Answers": [
        true,
        false,
        false,
        true,
        true,
    ]
  },
  {
    'WordPair': ['Tofu', 'Steak'],
    'Questions': [
      'Is it usually white?',
      'Is it usually oily/fatty?',
      'Is it usually used with butter?',
      'Is it usually used in Asian food?',
      'Is it animal product?'
    ],
    "Answers": [
      true,
      false,
      false,
      true,
      true,
    ]
  }
]

export default class Game {
  /**
   * @param {number} roomCode - Digits identifying which room the game is in
   * @property {array} chat - Chat history of the game
   * @property {boolean} gameIsStarted - Indicates if the game has started
   * @property {Object} gameState - True/false values indicating various stages of the game
   * @property {Object} roleList - Key/value pair of roles (and how many of each role) for the game
   * @property {array} players
   * @property {array} spectators
   * @property {Object} quests
   * @property {number} questFails - Number of failed quests
   * @property {number} questSuccesses - Number of successful quests
   * @property {number} leaderIndex 
   * @property {boolean} winningTeam - 'Good' or 'Evil'
   * @property {boolean} firstCorrect
   * @property {number} dictionaryIndex
   */
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.chat = [];
    this.gameIsStarted = false;
    this.gameState = {
      status: {
        msg: '',
        variant: ''
      },
      showAcceptOrRejectTeamBtns: false,
      showSucceedOrFailQuestBtns: false
    };
    this.roleList = {};
    this.players = [];
    this.spectators = [];
    this.quests = {};
    this.currentQuestNum = null;
    this.questFails = 0;
    this.questSuccesses = 0;
    this.leaderIndex = 0;
    this.winningTeam = null;
    this.firstCorrect = true;
    this.dictionaryIndex = 0;
  }

  static get BaseRoles() {
    return BaseRoles;
  }
  static get GoodTeam() {
    return GoodTeam;
  }

  /**
   * @param {Object} optionalRoles 
   */
  startGame(optionalRoles) {
    this.gameIsStarted = true;
    // shuffle(this.players);
    this.initializeQuests();
    this.assignRoles(optionalRoles);
  }

  resetGame() {
    this.resetPlayers();
    this.gameIsStarted = false;
    this.gameState = {
      status: {
        msg: '',
        variant: ''
      },
      showAcceptOrRejectTeamBtns: false,
      showSucceedOrFailQuestBtns: false
    };
    this.roleList = {};
    this.quests = {};
    this.questFails = 0;
    this.questSuccesses = 0;
    this.leaderIndex = 0;
    this.winningTeam = null;
  }

  initializeQuests() {
    this.quests = {
      1: new Quest(1, this.players.length),
      2: new Quest(2, this.players.length),
      3: new Quest(3, this.players.length),
      4: new Quest(4, this.players.length, this.players.length > 6),
      5: new Quest(5, this.players.length)
    };
    this.currentQuestNum = 1;
    this.players[0].leader = true;
    this.quests[1].currentQuest = true;
    this.quests[1].assignLeaderInfo({
      name: this.players[0].name,
      socketID: this.players[0].socketID
    });
  }

  /**
   * @param {string} socketID 
   * @param {string} name 
   * @param {string} type 
   */
  addPlayer(socketID, name, type) {
    this.players.push(new Player(socketID, name, type));
    const msg = { id: Date.now(), serverMsg: `${name} has joined the game.` };
    this.chat.push(msg);
    return msg;
  }

  /**
   * @param {string} socketID 
   * @param {string} name 
   * @param {string} type 
   */
  addSpectator(socketID, name, type) {
    this.spectators.push(new Player(socketID, name, type));
    const msg = { id: Date.now(), serverMsg: `${name} is spectating the game.` };
    this.chat.push(msg);
    return msg;
  }

  /**
   * @param key 
   * @param value
   */
  getPlayer(key, value) {
    return this.players.find(player => player[key] === value);
  }

  /**
   * @param key 
   * @param value
   */
  getSpectator(key, value) {
    return this.spectators.find(spectator => spectator[key] === value);
  }

  getCurrentQuest() {
    return this.quests[this.currentQuestNum];
  }

  /**
   * @param {string} name 
   */
  addPlayerToQuest(name) {
    let player = this.getPlayer('name', name);
    if (player && !player.onQuest && this.getCurrentQuest().playersNeededLeft > 0) {
      this.getCurrentQuest().addPlayer(name);
      player.onQuest = true;
      return true;
    }
    return false;
  }

  /**
   * @param {string} name 
   */
  removePlayerFromQuest(name) {
    let player = this.getPlayer('name', name);
    if (player && player.onQuest) {
      this.getCurrentQuest().removePlayer(name);
      player.onQuest = false;
      return true;
    }
    return false;
  }

  /**
   * @param {string} socketID 
   * @param {string} decision 
   */
  addTeamVote(socketID, decision) {
    let player = this.getPlayer('socketID', socketID);
    if (player && !player.voted) {
      this.getCurrentQuest().addTeamVote(player.name, decision);
      player.voted = true;
      return true;
    }
    return false;
  }

  assignTeamResult() {
    this.getCurrentQuest().assignTeamResult();
  }

  /**
   * @param {string} socketID 
   * @param {string} decision 
   */
  addQuestVote(socketID, decision) {
    let player = this.getPlayer('socketID', socketID);
    if (player && !player.voted) {
      this.getCurrentQuest().addQuestVote(decision);
      player.voted = true;
      return true;
    }
    return false;
  }

  assignQuestResult() {
    const questSuccessful = this.getCurrentQuest().assignQuestResult();
    questSuccessful ? this.questSuccesses++ : this.questFails++;
  }

  //TODO: deal with word guessing

  // /**
  //  * @param {string} socketID
  //  * @param {string} name
  //  * @returns {boolean}
  //  */
  // assassinatePlayer(name) {
  //   let playerToAssassinate = this.getPlayer('name', name);
  //   if (playerToAssassinate && playerToAssassinate.team === 'Good') {
  //     playerToAssassinate.assassinated = true;
  //     playerToAssassinate.role === 'Merlin' ? this.winningTeam = 'Evil' : this.winningTeam = 'Good';
  //     return true;
  //   }
  //   return false;
  // }

  /**
   * @param {string} name
   * @return {boolean} 
   */
  nameIsTaken(name) {
    return this.players.some(player => player.name === name) ||
      this.spectators.some(spectator => spectator.name === name);
  }

  /**
   * @param {string} arrayName
   * @param {string} socketID 
   */
  deletePersonFrom({ arrayName, socketID }) {
    for (let i in this[arrayName]) {
      if (this[arrayName][i].socketID === socketID) {
        this[arrayName].splice(i, 1); //delete 1 element at index i
        break;
      }
    }
  }

  resetPlayers() {
    this.players = this.players.filter(player => !player.disconnected);
    this.players.forEach(player => player.reset());
  }

  assignNextHost() {
    this.players[0].type = 'Host';
    return this.players[0];
  }

  assignNextLeader() {
    this.players[this.leaderIndex].leader = false; //reset prev leader Player object
    this.resetPlayersProperty('onQuest');
    this.getCurrentQuest().resetQuest();

    //increment leaderIndex (mod by playerLength so it wraps around)
    this.leaderIndex = (this.leaderIndex + 1) % this.players.length;

    //continue incrementing leaderIndex until we find next non-null player object
    while (this.players[this.leaderIndex] === null) {
      this.leaderIndex = (this.leaderIndex + 1) % this.players.length;
    }
    //assign new leader to correct Player
    this.players[this.leaderIndex].leader = true;
    this.getCurrentQuest().assignLeaderInfo({
      name: this.players[this.leaderIndex].name,
      socketID: this.players[this.leaderIndex].socketID
    });
  }

  startNextQuest() {
    if (this.currentQuestNum < 5) {
      this.quests[this.currentQuestNum].currentQuest = false;
      this.quests[this.currentQuestNum += 1].currentQuest = true;
      this.assignNextLeader();
    }
  }

  getTrueWord() {
    return Dictionary[this.dictionaryIndex].WordPair[this.firstCorrect ? 0 : 1]
  }

  getFalseWord() {
    return Dictionary[this.dictionaryIndex].WordPair[this.firstCorrect ? 1 : 0]
  }

  /**
   * @param {Object} optionalRoles 
   */
  assignRoles(optionalRoles) {
    let shuffledIdentities;
    let teamObj = JSON.parse(JSON.stringify(Game.BaseRoles[this.players.length]));
    this.dictionaryIndex = Math.floor(Math.random() * (Dictionary.length + 1))
    this.firstCorrect = Math.random() > 0.5
    this.roleList = populateRoleList(teamObj);
    shuffledIdentities = shuffle(objectToArray(teamObj));
    for (let i in this.players) {
      let word = "";
      let team = "";
      if (shuffledIdentities[i] === "GoodTrue") {
        word = this.getTrueWord()
        team = "Good"
      } else if (shuffledIdentities[i] === "GoodFalse") {
        word = this.getFalseWord()
        team = "Good"
      } else {
        word = "Imposter"
        team = "Evil"
      }
      this.players[i].word = word;
      this.players[i].team = team;
    }
  }

  /**
   * @param {string} property 
   */
  resetPlayersProperty(property) {
    this.players.forEach(player => {
      player[property] = false;
    });
  }

}
