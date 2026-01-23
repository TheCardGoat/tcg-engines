import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboTheFlyingElephant: CharacterCard = {
  id: "ab9",
  cardType: "character",
  name: "Dumbo",
  version: "The Flying Elephant",
  fullName: "Dumbo - The Flying Elephant",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "252b4d93bdf671a8ad7c6c28742c3add6473ac4b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const dumboTheFlyingElephant: LorcanitoCharacterCard = {
//   id: "qcy",
//   name: "Dumbo",
//   title: "The Flying Elephant",
//   characteristics: ["storyborn", "hero"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Sandra Tang",
//   number: 46,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647679,
//   },
//   rarity: "uncommon",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThisCharacter({
//       name: "AERIAL DUO",
//       text: "When you play this character, chosen character gains Evasive until the start of your next turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           duration: "next_turn",
//           modifier: "add",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
