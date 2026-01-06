import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const bePrepared: ActionCard = {
  id: "z06",
  cardType: "action",
  name: "Be Prepared",
  version: "",
  fullName: "Be Prepared",
  inkType: [
    "ruby",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 7 or more can {E} to sing this
song for free.)_
Banish all characters.",
  cost: 7,
  cardNumber: 128,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 506077,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      id: "z06-1",
      text: "Banish all characters.",
    },
  ],
};
