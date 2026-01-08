import type { CharacterCard } from "@tcg/lorcana-types";

export const timothyQMouseFlightInstructor: CharacterCard = {
  id: "101",
  cardType: "character",
  name: "Timothy Q. Mouse",
  version: "Flight Instructor",
  fullName: "Timothy Q. Mouse - Flight Instructor",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 47,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83c5d69561cb4f019f39e91441460af1cc3d538a",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileYouHaveCharacterWithAbility } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const timothyQMouseFlightInstructor: LorcanitoCharacterCard = {
//   id: "o6m",
//   missingTestCase: false,
//   name: "Timothy Q. Mouse",
//   title: "Flight Instructor",
//   characteristics: ["storyborn", "mentor"],
//   text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Grace Tran",
//   number: 47,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647678,
//   },
//   rarity: "common",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "LET'S SHOW 'EM, DUMBO!",
//       text: "While you have a character with Evasive in play, this character gets +1 {L}.",
//       attribute: "lore",
//       amount: 1,
//       conditions: [whileYouHaveCharacterWithAbility("evasive")],
//     }),
//   ],
//   lore: 1,
// };
//
