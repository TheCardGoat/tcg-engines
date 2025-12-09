import type { CharacterCard } from "@tcg/lorcana";

export const captainHookThinkingAHappyThought: CharacterCard = {
  id: "4hp",
  cardType: "character",
  name: "Captain Hook",
  version: "Thinking a Happy Thought",
  fullName: "Captain Hook - Thinking a Happy Thought",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nChallenger +3 (While challenging, this character gets +3 {S}.)\nSTOLEN DUST Characters with cost 3 or less can't challenge this character.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 175,
  inkable: false,
  externalIds: {
    ravensburger: "1030555f87af5d3d70406e6d85cf3a40ae98e4f2",
  },
  abilities: [
    {
      id: "4hp-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "4hp-2",
      text: "Challenger +3",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    },
    {
      id: "4hp-3",
      text: "STOLEN DUST Characters with cost 3 or less can't challenge this character.",
      name: "STOLEN DUST",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
};
