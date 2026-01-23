// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mickeyMouseGiantMouse: LorcanitoCharacterCard = {
//   id: "vyt",
//   name: "Mickey Mouse",
//   title: "Giant Mouse",
//   characteristics: ["dreamborn", "hero"],
//   text: "Bodyguard\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     whenThisCharacterBanished({
//       name: "THE BIGGEST STAR EVER",
//       text: "When this character is banished, deal 5 damage to each opposing character.",
//       effects: [
//         dealDamageEffect(5, {
//           type: "card",
//           value: "all",
//           filters: [
//             {
//               filter: "owner",
//               value: "opponent",
//             },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 10,
//   strength: 10,
//   willpower: 10,
//   illustrator: "Joy Ang / Giulia Riva",
//   number: 199,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631331,
//   },
//   rarity: "legendary",
//   lore: 5,
// };
//
