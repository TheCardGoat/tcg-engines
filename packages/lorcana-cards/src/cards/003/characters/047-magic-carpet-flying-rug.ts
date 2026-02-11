import type { CharacterCard } from "@tcg/lorcana-types";

export const magicCarpetFlyingRug: CharacterCard = {
  abilities: [
    {
      id: "14a-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "9057e685beb641fbff4086da8f552e1388fa0350",
  },
  franchise: "Aladdin",
  fullName: "Magic Carpet - Flying Rug",
  id: "14a",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Magic Carpet",
  set: "003",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nFIND THE WAY {E} — Move a character of yours to a location for free.",
  version: "Flying Rug",
  willpower: 1,
};
