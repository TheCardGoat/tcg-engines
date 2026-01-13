import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyKnightApprentice: CharacterCard = {
  id: "1w8",
  cardType: "character",
  name: "Dopey",
  version: "Knight Apprentice",
  fullName: "Dopey - Knight Apprentice",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f677c49becf6b4fbd214ebd4f49bda04509c285d",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dopeyKnightApprentice: LorcanitoCharacterCard = {
//   id: "hwb",
//   missingTestCase: true,
//   name: "Dopey",
//   title: "Knight Apprentice",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Stronger Together",
//       text: "When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
//       optional: true,
//       resolutionConditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "characteristics", value: ["knight"] },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//           ],
//           comparison: { operator: "gte", value: 2 },
//         },
//       ],
//       effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 181,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559667,
//   },
//   rarity: "common",
// };
//
