import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookMasterSwordsman: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "ready",
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
        type: "sequence",
      },
      id: "gip-1",
      name: "NEMESIS",
      text: "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "gip-2",
      text: "MAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.",
      type: "action",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  cost: 5,
  externalIds: {
    ravensburger: "3b89ba6f1bf6a66aaa92aef90c5f0d4128649fc9",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Master Swordsman",
  id: "gip",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Captain Hook",
  set: "003",
  strength: 5,
  text: "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.\nMAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.",
  version: "Master Swordsman",
  willpower: 4,
};
