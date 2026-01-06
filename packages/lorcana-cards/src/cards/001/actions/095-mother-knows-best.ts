import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const motherKnowsBest: ActionCard = {
  id: "rxk",
  cardType: "action",
  name: "Mother Knows Best",
  version: "",
  fullName: "Mother Knows Best",
  inkType: [
    "emerald",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this
song for free.)_
Return chosen character to their player's hand.",
  cost: 3,
  cardNumber: 95,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 506100,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
      id: "rxk-1",
      text: "Return chosen character to their player's hand.",
    },
  ],
};
