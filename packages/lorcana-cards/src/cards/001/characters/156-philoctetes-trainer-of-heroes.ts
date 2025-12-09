import type { CharacterCard } from "@tcg/lorcana";

export const philoctetesTrainerOfHeroes: CharacterCard = {
  id: "1g8",
  cardType: "character",
  name: "Philoctetes",
  version: "Trainer of Heroes",
  fullName: "Philoctetes - Trainer of Heroes",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  externalIds: {
    ravensburger: "bc5a3301196e31a727216ba5bd0ecf0f0dcae69a",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1g8-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
