export default class Player {
  /**
   * @param {string} socketID
   * @param {string} name - The nickname entered by the player when they join the room
   * @param {string} type - 'Guest' if joining a room, 'Host' if creating a room
   * @property {string} team - 'Good' or 'Evil'
   * @property {string} word - Player's world
   * @property {boolean} leader - Indicates if the player is the leader of the quest
   * @property {boolean} onQuest - Indicates if the player is on the quest 
   * @property {boolean} voted - Indicates if the player has voted on team/quest
   * @property {boolean} disconnected - Indicates if the player is disconnected from a started game
   * @property {boolean} assassinated - Indicates if the player was assassinated
   * @property {string[]} knownIdentities - A list of the player names whose team or identity is known to this player
   */
  constructor(socketID, name, type) {
    this.socketID = socketID;
    this.name = name;
    this.type = type;
    this.reset()
  }

  reconnect(socketID) {
    this.socketID = socketID;
    this.disconnected = false;
  }

  reset() {
    this.team = '';
    this.word = '';
    this.leader = false;
    this.onQuest = false;
    this.voted = false;
    this.disconnected = false;
    this.assassinated = false;
  }
}
