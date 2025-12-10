import type { CharacterCard } from "@tcg/lorcana";

export const louieChillNephew: CharacterCard = {
  id: "1ac",
  cardType: "character",
  name: "Louie",
  version: "Chill Nephew",
  fullName: "Louie - Chill Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  externalIds: {
    ravensburger: "a70aef349e62cbf271e5f595be6b22aeb3d34724",
  },
  abilities: [
    {
      id: "1ac-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
