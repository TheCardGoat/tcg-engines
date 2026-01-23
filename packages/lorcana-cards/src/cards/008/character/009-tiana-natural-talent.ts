// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { eachOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tianaNaturalTalent: LorcanitoCharacterCard = {
//   id: "ke9",
//   name: "Tiana",
//   title: "Natural Talent",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     singerAbility(6),
//     wheneverYouPlayASong({
//       name: "CAPTIVATING MELODY",
//       text: "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: eachOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Milica Cetkovic",
//   number: 9,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631333,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
