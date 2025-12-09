import type { CharacterCard } from "@tcg/lorcana";

export const zazuAdvisorToMufasa: CharacterCard = {
  id: "7uk",
  cardType: "character",
  name: "Zazu",
  version: "Advisor to Mufasa",
  fullName: "Zazu - Advisor to Mufasa",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "1c49ac7ff34fcbbbd4e8e2c2cc50bc858e2cb391",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "7uk-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
