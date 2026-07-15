import type { CharacterCard } from "@tcg/lorcana-types";

export const kaaSecretiveSnake: CharacterCard = {
  abilities: [
    {
      id: "r2h-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 212,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "618ecda72b6d469648e0b167bd013d03dc4e62f6",
  },
  franchise: "Jungle Book",
  fullName: "Kaa - Secretive Snake",
  id: "r2h",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  name: "Kaa",
  set: "010",
  strength: 6,
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  version: "Secretive Snake",
  willpower: 7,
};
