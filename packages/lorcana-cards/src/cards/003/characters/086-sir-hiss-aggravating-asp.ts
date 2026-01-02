import type { CharacterCard } from "@tcg/lorcana-types";

export const sirHissAggravatingAsp: CharacterCard = {
  id: "1vd",
  cardType: "character",
  name: "Sir Hiss",
  version: "Aggravating Asp",
  fullName: "Sir Hiss - Aggravating Asp",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  externalIds: {
    ravensburger: "f2df9a64c41a939980ee70dfe3cce16063dffbfb",
  },
  abilities: [
    {
      id: "1vd-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
