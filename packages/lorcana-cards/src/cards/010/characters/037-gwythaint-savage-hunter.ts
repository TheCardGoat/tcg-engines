import type { CharacterCard } from "@tcg/lorcana-types";

export const gwythaintSavageHunter: CharacterCard = {
  abilities: [
    {
      id: "grx-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Dragon"],
  cost: 5,
  externalIds: {
    ravensburger: "3c7620143a9295e9596253819d51cf19b637c0a5",
  },
  franchise: "Black Cauldron",
  fullName: "Gwythaint - Savage Hunter",
  id: "grx",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Gwythaint",
  set: "010",
  strength: 4,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
  version: "Savage Hunter",
  willpower: 3,
};
