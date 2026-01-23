import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusCloudRacer: CharacterCard = {
  id: "1b8",
  cardType: "character",
  name: "Pegasus",
  version: "Cloud Racer",
  fullName: "Pegasus - Cloud Racer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pegasus.)\nEvasive (Only characters with Evasive can challenge this character.)\nHOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 83,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "abaaf071fa4ea8b6931182d9e08847f123d363c2",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const pegasusCloudRacer: LorcanitoCharacterCard = {
//   id: "p3p",
//   name: "Pegasus",
//   title: "Cloud Racer",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Pegasus.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**HOP ON!** When you play this character, if you used **Shift** to play him, your characters gain **Evasive** until the start of your next turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "pegasus"),
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "HOP ON!",
//       text: "When you play this character, if you used **Shift** to play him, your characters gain **Evasive** until the start of your next turn.",
//       resolutionConditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Brian Weisz",
//   number: 83,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549387,
//   },
//   rarity: "uncommon",
// };
//
