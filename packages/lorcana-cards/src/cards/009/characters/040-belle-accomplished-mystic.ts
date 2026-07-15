import type { CharacterCard } from "@tcg/lorcana-types";

export const belleAccomplishedMystic: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "12p-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
  ],
  cardNumber: 40,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "8b86289e61950b00539d3ef5740fe6097f42fc88",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Accomplished Mystic",
  id: "12p",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Belle",
  set: "009",
  strength: 4,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nENHANCED HEALING When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
  version: "Accomplished Mystic",
  willpower: 4,
};
