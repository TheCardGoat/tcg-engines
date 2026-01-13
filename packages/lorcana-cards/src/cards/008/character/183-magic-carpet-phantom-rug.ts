// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   vanishAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const magicCarpetPhantomRug: LorcanitoCharacterCard = {
//   id: "eer",
//   name: "Magic Carpet",
//   title: "Phantom Rug",
//   characteristics: ["dreamborn", "ally", "illusion"],
//   text: "Vanish\nSPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
//   type: "character",
//   abilities: [
//     vanishAbility,
//     yourOtherCharactersWithGain({
//       name: "SPECTRAL FORCE",
//       text: "Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
//       gainedAbility: challengerAbility(1),
//       filter: { filter: "characteristics", value: ["illusion"] },
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Andrea Parisi",
//   number: 183,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631472,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
