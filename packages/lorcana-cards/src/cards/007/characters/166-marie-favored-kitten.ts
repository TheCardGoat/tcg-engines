import type { CharacterCard } from "@tcg/lorcana-types";

export const marieFavoredKitten: CharacterCard = {
  id: "104",
  cardType: "character",
  name: "Marie",
  version: "Favored Kitten",
  fullName: "Marie - Favored Kitten",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "007",
  text: "I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "81dd4eed0402aea8e6e1f4d7519caf40b6da4199",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const marieFavoredKitten: LorcanitoCharacterCard = {
//   id: "r8k",
//   name: "Marie",
//   title: "Favored Kitten",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Ellie Horie",
//   number: 166,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618156,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   text: "I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "I'LL SHOW YOU",
//       text: "Whenever this character quests, you may give chosen character -2 {S} this turn.",
//       effects: [chosenCharacterGetsStrength(-2)],
//     }),
//   ],
// };
//
