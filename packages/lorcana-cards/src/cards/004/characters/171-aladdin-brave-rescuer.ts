import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBraveRescuer: CharacterCard = {
  id: "on2",
  cardType: "character",
  name: "Aladdin",
  version: "Brave Rescuer",
  fullName: "Aladdin - Brave Rescuer",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  text: "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)\nCRASHING THROUGH Whenever this character quests, you may banish chosen item.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 171,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "58ce9f9e7b38c0ef9c7d5b24e03675a9b0c0e182",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   BanishEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const aladdinBraveRescuer: LorcanitoCharacterCard = {
//   id: "gf4",
//   name: "Aladdin",
//   title: "Brave Rescuer",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)_\n\n**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.",
//   type: "character",
//   abilities: [
//     shiftAbility(
//       [
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "location" },
//           ],
//         },
//       ],
//       "Aladdin",
//       "**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)",
//     ),
//     wheneverQuests({
//       optional: true,
//       name: "CRASHING THROUGH",
//       text: "Whenever this character quests, you may banish chosen item.",
//       effects: [
//         {
//           type: "banish",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         } as BanishEffect,
//       ],
//     }),
//     {
//       name: "**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.",
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Randy Bishop",
//   number: 171,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547768,
//   },
//   rarity: "uncommon",
// };
//
