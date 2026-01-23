import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseFunkySpelunker: CharacterCard = {
  id: "11y",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Funky Spelunker",
  fullName: "Minnie Mouse - Funky Spelunker",
  inkType: ["steel"],
  set: "003",
  text: "JOURNEY While this character is at a location, she gets +2 {S}.",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "03cd2ba64edd0e7a28f0f078e1b44e0cff723283",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileCharacterIsAtLocationItGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const minnieMouseFunkySpelunker: LorcanitoCharacterCard = {
//   id: "h35",
//   name: "Minnie Mouse",
//   title: "Funky Spelunker",
//   characteristics: ["hero", "dreamborn"],
//   text: "**JOURNEY** While this character is at a location, she gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileCharacterIsAtLocationItGets({
//       name: "Journey",
//       text: "While this character is at a location, she gets +2 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "She'll never cave under pressure.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   willpower: 3,
//   strength: 0,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 183,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531824,
//   },
//   rarity: "common",
// };
//
