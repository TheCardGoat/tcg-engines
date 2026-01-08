import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceAccidentallyAdrift: CharacterCard = {
  id: "ijg",
  cardType: "character",
  name: "Alice",
  version: "Accidentally Adrift",
  fullName: "Alice - Accidentally Adrift",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "42d28673c7cc3a36053276edd16cc2814ee60ebc",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenItem,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aliceAccidentallyAdrift: LorcanitoCharacterCard = {
//   id: "rql",
//   missingTestCase: false,
//   name: "Alice",
//   title: "Accidentally Adrift",
//   characteristics: ["storyborn", "hero"],
//   text: "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "",
//   number: 141,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650076,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "WASHED AWAY",
//       text: "When you play this character, you may put chosen item into its player's inkwell facedown and exerted.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenItem,
//         },
//       ],
//     }),
//     wheneverThisCharacterQuests({
//       name: "MAKING WAVES",
//       text: "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
//       effects: [getStrengthThisTurn(-2, chosenOpposingCharacter)],
//     }),
//   ],
//   lore: 2,
// };
//
