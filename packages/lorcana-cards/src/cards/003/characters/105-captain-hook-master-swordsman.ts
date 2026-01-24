import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookMasterSwordsman: CharacterCard = {
  id: "gip",
  cardType: "character",
  name: "Captain Hook",
  version: "Master Swordsman",
  fullName: "Captain Hook - Master Swordsman",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.\nMAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3b89ba6f1bf6a66aaa92aef90c5f0d4128649fc9",
  },
  abilities: [
    {
      id: "gip-1",
      type: "triggered",
      name: "NEMESIS",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "sequence",
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
      },
      text: "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.",
    },
    {
      id: "gip-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
      text: "MAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};
