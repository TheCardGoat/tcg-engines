// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const trampDapperRascal: LorcanitoCharacterCard = {
//   id: "xdy",
//   name: "Tramp",
//   title: "Dapper Rascal",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)\nPLAY IT COOL During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Tramp"),
//     wheneverOneOfYouCharactersIsBanished({
//       name: "PLAY IT COOL",
//       text: "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
//       optional: true,
//       conditions: [{ type: "during-turn", value: "opponent" }],
//       triggerTarget: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber", "emerald"],
//   cost: 6,
//   strength: 2,
//   willpower: 8,
//   illustrator: "Erika Wiseman",
//   number: 22,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631366,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
