import type { CharacterCard } from "@tcg/lorcana-types";

export const kaaSecretiveSnake: CharacterCard = {
  id: "r2h",
  cardType: "character",
  name: "Kaa",
  version: "Secretive Snake",
  fullName: "Kaa - Secretive Snake",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 7,
  strength: 6,
  willpower: 7,
  lore: 3,
  cardNumber: 79,
  inkable: true,
  externalIds: {
    ravensburger: "618ecda72b6d469648e0b167bd013d03dc4e62f6",
  },
  abilities: [
    {
      id: "r2h-1",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
