import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckShushAgent: CharacterCard = {
  id: "1l2",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "S.H.U.S.H. Agent",
  fullName: "Scrooge McDuck - S.H.U.S.H. Agent",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.\nON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  cardNumber: 89,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ceb1cc76a3d7c4502d62833632b06e23eadf46f8",
  },
  abilities: [
    {
      id: "1l2-1",
      type: "triggered",
      name: "BACKUP PLAN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
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
      },
      text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.",
    },
    {
      id: "1l2-2",
      type: "triggered",
      name: "ON THE MOVE",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "ON THE MOVE When this character is challenged, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
