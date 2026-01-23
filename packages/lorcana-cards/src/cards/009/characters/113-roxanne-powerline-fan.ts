import type { CharacterCard } from "@tcg/lorcana-types";

export const roxannePowerlineFan: CharacterCard = {
  id: "1w5",
  cardType: "character",
  name: "Roxanne",
  version: "Powerline Fan",
  fullName: "Roxanne - Powerline Fan",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f59dc3536d9dcaa73e7a35d975e4f99e5cb4c07a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileYouHaveCharacterWithAbility } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const roxannePowerlineFan: LorcanitoCharacterCard = {
//   id: "rpf",
//   name: "Roxanne",
//   title: "Powerline Fan",
//   characteristics: ["storyborn"],
//   text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "",
//   number: 113,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650049,
//   },
//   rarity: "common",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "CONCERT LOVER",
//       text: "While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
//       attribute: "lore",
//       amount: 1,
//       conditions: [whileYouHaveCharacterWithAbility("singer")],
//     }),
//     whileConditionThisCharacterGets({
//       name: "CONCERT LOVER",
//       text: "While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
//       attribute: "strength",
//       amount: 1,
//       conditions: [whileYouHaveCharacterWithAbility("singer")],
//     }),
//   ],
//   lore: 1,
// };
//
