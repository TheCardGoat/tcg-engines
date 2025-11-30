import type { CharacterCard } from "@tcg/lorcana";

export const sirHissAggravatingAsp: CharacterCard = {
  id: "1vh",
  cardType: "character",
  name: "Sir Hiss",
  version: "Aggravating Asp",
  fullName: "Sir Hiss - Aggravating Asp",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "086",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "f2df9a64c41a939980ee70dfe3cce16063dffbfb",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1vha1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
