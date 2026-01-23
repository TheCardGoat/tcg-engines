import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseEnthusiasticDancer: CharacterCard = {
  id: "18m",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Enthusiastic Dancer",
  fullName: "Mickey Mouse - Enthusiastic Dancer",
  inkType: ["ruby"],
  set: "005",
  text: "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 112,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a0cc1cbe850b058691e14ae966fb8a3cf4055116",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileYouHaveACharacterNamedThisCharGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const mickeyMouseEnthusiasticDancer: LorcanitoCharacterCard = {
//   id: "giv",
//   missingTestCase: true,
//   name: "Mickey Mouse",
//   title: "Enthusiastic Dancer",
//   characteristics: ["hero", "dreamborn"],
//   text: "**PERFECT PARTNERS** While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGets({
//       name: "Perfect Partners",
//       text: "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
//       characterName: "Minnie Mouse",
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
//   flavour: "He loves to share the spotlight with a star like Minnie.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Raquel Villanueva",
//   number: 112,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557293,
//   },
//   rarity: "common",
// };
//
