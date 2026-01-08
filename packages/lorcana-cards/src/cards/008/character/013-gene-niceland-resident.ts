// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const geneNicelandResident: LorcanitoCharacterCard = {
//   id: "pmu",
//   name: "Gene",
//   title: "Niceland Resident",
//   characteristics: ["storyborn"],
//   text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "I GUESS YOU EARNED THIS",
//       text: "Whenever this character quests, you may remove up to 2 damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Rianti Hidayat",
//   number: 13,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631357,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
