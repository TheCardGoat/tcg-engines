import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherMasterManipulator: CharacterCard = {
  id: "x28",
  cardType: "character",
  name: "Bellwether",
  version: "Master Manipulator",
  fullName: "Bellwether - Master Manipulator",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77285cc484c8b9f8fc9016f4c1af15826c639181",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { eachOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const bellwetherMasterManipulator: LorcanitoCharacterCard = {
//   id: "fjp",
//   name: "Bellwether",
//   title: "Master Manipulator",
//   characteristics: ["storyborn", "villain"],
//   text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Kenneth Anderson",
//   number: 82,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658342,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenChallengedAndBanished({
//       name: "VENDETTA",
//       text: "When this character is challenged and banished, put 1 damage counter on each opposing character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: eachOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
