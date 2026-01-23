import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExtremeAthlete: CharacterCard = {
  id: "15u",
  cardType: "character",
  name: "Goofy",
  version: "Extreme Athlete",
  fullName: "Goofy - Extreme Athlete",
  inkType: ["ruby"],
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  cost: 7,
  strength: 7,
  willpower: 6,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96d401c6b682205be0432b7df1aee5a9856f9a11",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const goofyExtremeAthlete: LorcanitoCharacterCard = {
//   id: "pve",
//   name: "Goofy",
//   title: "Extreme Athlete",
//   characteristics: ["storyborn", "ally"],
//   text: "Evasive\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverChallengesAnotherChar({
//       name: "STAR POWER",
//       text: "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: yourOtherCharacters,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 7,
//   willpower: 6,
//   illustrator: "Teresita O.",
//   number: 139,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619484,
//   },
//   rarity: "super_rare",
//   lore: 1,
// };
//
