// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mrSnoopsBetrayedPartner: LorcanitoCharacterCard = {
//   id: "tc2",
//   name: "Mr. Snoops",
//   title: "Betrayed Partner",
//   characteristics: ["storyborn", "ally"],
//   text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "nocturne",
//   number: 143,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631768,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     whenThisCharacterBanished({
//       name: "DOUBLE-CROSSING CROOK!",
//       text: "During your turn, when this character is banished, you may draw a card.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
// };
//
