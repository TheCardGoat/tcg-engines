import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const oneJumpAhead: ActionCard = {
  id: "gf6",
  cardType: "action",
  name: "One Jump Ahead",
  version: "",
  fullName: "One Jump Ahead",
  inkType: [
    "sapphire",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_
Put the top card of your deck into your inkwell facedown and exerted.",
  cost: 2,
  cardNumber: 164,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492726,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      id: "gf6-1",
      text: "Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
