import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckShushAgent: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
        type: "sequence",
      },
      id: "1l2-1",
      name: "BACKUP PLAN",
      text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "1l2-2",
      name: "ON THE MOVE",
      text: "ON THE MOVE When this character is challenged, return this card to your hand.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "ceb1cc76a3d7c4502d62833632b06e23eadf46f8",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - S.H.U.S.H. Agent",
  id: "1l2",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "010",
  strength: 0,
  text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.\nON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
  version: "S.H.U.S.H. Agent",
  willpower: 2,
};
