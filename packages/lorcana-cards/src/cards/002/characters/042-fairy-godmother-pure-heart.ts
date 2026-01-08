import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherPureHeart: CharacterCard = {
  id: "109",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Pure Heart",
  fullName: "Fairy Godmother - Pure Heart",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 42,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83b99c29716dc645e59792cecd067f6715bc51fd",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const fairyGodmotherPureHeart: LorcanitoCharacterCard = {
//   id: "e6p",
//
//   name: "Fairy Godmother",
//   title: "Pure Heart",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**JUST LEAVE IT TO ME** Whenever you play a character named Cinderella, you may exert chosen character.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "Just Leave It To Me",
//       text: "Whenever you play a character named Cinderella, you may exert chosen character.",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "cinderella" },
//           },
//         ],
//       },
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "We'll have to hurry, because even miracles take a little time.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Matt Chapman",
//   number: 42,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527735,
//   },
//   rarity: "common",
// };
//
