import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnOpportunisticBriber: CharacterCard = {
  id: "qie",
  cardType: "character",
  name: "Prince John",
  version: "Opportunistic Briber",
  fullName: "Prince John - Opportunistic Briber",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 141,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5f8c0c0fd0e465bfd49daea0ba1e50025bacae69",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const princeJohnOpportunisticBriber: LorcanitoCharacterCard = {
//   id: "xu2",
//   name: "Prince John",
//   title: "Opportunistic Briber",
//   characteristics: ["dreamborn", "villain", "prince"],
//   text: "**TAXES NEVER FAIL ME** Whenever you play an item, this character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverTargetPlays({
//       name: "TAXES NEVER FAIL ME",
//       text: "Whenever you play an item, this character gets +2 {S} this turn.",
//       triggerFilter: [
//         { filter: "type", value: "item" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//           duration: "turn",
//         },
//       ],
//     }),
//   ],
//   flavour: "Of course I’m on the list. Check under ‘PJ.’",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Carlos Gomes Cabral",
//   number: 141,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561648,
//   },
//   rarity: "common",
// };
//
