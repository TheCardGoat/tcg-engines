import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const letItGo: ActionCard = {
  id: "n1y",
  cardType: "action",
  name: "Let It Go",
  version: "",
  fullName: "Let It Go",
  inkType: [
    "sapphire",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_
Put chosen character into their player's inkwell facedown and exerted.",
  cost: 5,
  cardNumber: 163,
  inkable: true,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492997,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      id: "n1y-1",
      text: "Put chosen character into their player's inkwell facedown and exerted.",
    },
  ],
};
