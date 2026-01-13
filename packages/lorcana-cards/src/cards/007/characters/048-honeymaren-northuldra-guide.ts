import type { CharacterCard } from "@tcg/lorcana-types";

export const honeymarenNorthuldraGuide: CharacterCard = {
  id: "1d4",
  cardType: "character",
  name: "Honeymaren",
  version: "Northuldra Guide",
  fullName: "Honeymaren - Northuldra Guide",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b37f54cccdfd81e4fac8a77d3054a00ee72b292d",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { taleOfTheFifthSpiritAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const honeymarenNorthuldraGuide: LorcanitoCharacterCard = {
//   id: "q36",
//   name: "Honeymaren",
//   title: "Northuldra Guide",
//   characteristics: ["storyborn", "ally"],
//   text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
//   type: "character",
//   abilities: [taleOfTheFifthSpiritAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Alexandria Neonakis",
//   number: 48,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619432,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
