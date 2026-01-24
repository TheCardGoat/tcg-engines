import type { CharacterCard } from "@tcg/lorcana-types";

export const magicCarpetFlyingRug: CharacterCard = {
  id: "14a",
  cardType: "character",
  name: "Magic Carpet",
  version: "Flying Rug",
  fullName: "Magic Carpet - Flying Rug",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nFIND THE WAY {E} — Move a character of yours to a location for free.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 47,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9057e685beb641fbff4086da8f552e1388fa0350",
  },
  abilities: [
    {
      id: "14a-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
