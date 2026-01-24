import type { CharacterCard } from "@tcg/lorcana-types";

export const belleAccomplishedMystic: CharacterCard = {
  id: "12p",
  cardType: "character",
  name: "Belle",
  version: "Accomplished Mystic",
  fullName: "Belle - Accomplished Mystic",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nENHANCED HEALING When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 40,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b86289e61950b00539d3ef5740fe6097f42fc88",
  },
  abilities: [
    {
      id: "12p-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Sorcerer"],
};
