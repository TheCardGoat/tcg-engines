import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomAerialCleaner: CharacterCard = {
  id: "1wc",
  cardType: "character",
  name: "Magic Broom",
  version: "Aerial Cleaner",
  fullName: "Magic Broom - Aerial Cleaner",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  text: "WINGED FOR A DAY During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 185,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f6509eea3856a16a7ece4d30d8f5d504b976f27f",
  },
  abilities: [],
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const magicBroomAerialCleaner: LorcanitoCharacterCard = {
//   id: "t2t",
//   missingTestCase: true,
//   name: "Magic Broom",
//   title: "Aerial Cleaner",
//   characteristics: ["dreamborn", "broom"],
//   text: "**WINGED FOR A DAY** During your turn, this character gains **Evasive.** _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     duringYourTurnGains(
//       "WINGED FOR A DAY",
//       "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//       evasiveAbility,
//     ),
//   ],
//   flavour:
//     "It spends its days keeping the treasured glimmers in the Hall of Lorcana sparkling clean.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alibeth Zermeno",
//   number: 185,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547705,
//   },
//   rarity: "common",
// };
//
