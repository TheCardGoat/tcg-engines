import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const sebastian: CharacterCard = {
  id: "pj3",
  cardType: "character",
  name: "Sebastian",
  version: "Court Composer",
  fullName: "Sebastian - Court Composer",
  inkType: ["amber"],
  franchise: "The Little Mermaid",
  set: "001",
  text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 504540,
  },
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "keyword",
      keyword: "Singer",
      value: 4,
      id: "pj3-1",
      text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
    },
  ],
};
