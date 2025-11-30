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
  cardNumber: "140",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "a70aef349e62cbf271e5f595be6b22aeb3d34724",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1ac-ability-1",
      text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
