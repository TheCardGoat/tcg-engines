import type { CharacterCard } from "@tcg/lorcana-types";

export const chifuImperialAdvisor: CharacterCard = {
  id: "m5z",
  cardType: "character",
  name: "Chi-Fu",
  version: "Imperial Advisor",
  fullName: "Chi-Fu - Imperial Advisor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fe35d3556761c5dcb31d03ea92e405eb1f8c27e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileThisCharacterHasNoDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const chiFuImperialAdvisor: LorcanitoCharacterCard = {
//   id: "jnk",
//   missingTestCase: true,
//   name: "Chi-Fu",
//   title: "Imperial Advisor",
//   characteristics: ["storyborn", "ally"],
//   text: "**OVERLY CAUTIOUS** While this character has no damage, he gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileThisCharacterHasNoDamageGets({
//       name: "Overly Cautious",
//       text: "While this character has no damage, he gets +2 {L}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 2,
//           modifier: "add",
//           duration: "static",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "You , there! Keep that fighting away from here! It is imperative that I write to the Emperor.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 0,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Gaku Kumatori",
//   number: 177,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548193,
//   },
//   rarity: "uncommon",
// };
//
