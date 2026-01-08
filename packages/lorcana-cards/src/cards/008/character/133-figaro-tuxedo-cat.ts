// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { targetCharacterGains } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const figaroTuxedoCat: LorcanitoCharacterCard = {
//   id: "u7y",
//   name: "Figaro",
//   title: "Tuxedo Cat",
//   characteristics: ["storyborn", "ally"],
//   text: "PLAYFULNESS Opposing items enter play exerted.",
//   type: "character",
//   abilities: [
//     targetCharacterGains({
//       name: "PLAYFULNESS",
//       text: "Opposing items enter play exerted.",
//       gainedAbility: entersPlayExerted({
//         name: "PLAYFULNESS",
//       }),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "opponent" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Saulo Nate",
//   number: 133,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 632714,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
