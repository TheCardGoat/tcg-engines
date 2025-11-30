import type { CharacterCard } from "@tcg/lorcana";

export const moanaUndeterredVoyager: CharacterCard = {
  id: "d5c",
  cardType: "character",
  name: "Moana",
  version: "Undeterred Voyager",
  fullName: "Moana - Undeterred Voyager",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "116",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "2f63375cd85e72b1c7c5774f2318433677ff7601",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "d5ca1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
