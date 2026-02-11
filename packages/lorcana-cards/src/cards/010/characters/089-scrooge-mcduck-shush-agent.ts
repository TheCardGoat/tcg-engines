import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckShushAgent: CharacterCard = {
  abilities: [
    {
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
      id: "1l2-1",
      name: "BACKUP PLAN",
      text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "1l2-2",
      name: "ON THE MOVE",
      text: "ON THE MOVE When this character is challenged, return this card to your hand.",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
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
