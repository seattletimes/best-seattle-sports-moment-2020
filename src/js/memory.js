var slot = "jersey-bracket-2019"
var memory = localStorage.getItem(slot) || "{}";
memory = JSON.parse(memory);

module.exports = {
  getVotes: round => memory[round] || {},
  setVote: function(round, index) {
    if (!memory[round]) memory[round] = {};
    memory[round][index] = true;
    localStorage.setItem(slot, JSON.stringify(memory));
  }
};
