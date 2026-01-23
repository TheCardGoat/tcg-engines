// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const kuzcoWantedLlama: LorcanitoCharacterCard = {
//   id: "cng",
//   reprints: ["q3b"],
//   name: "Kuzco",
//   title: "Wanted Llama",
//   characteristics: ["storyborn", "king"],
//   text: "**OK, WHERE AM I?** When this character is banished, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "OK, Where Am I?",
//       text: "When this character is banished, you may draw a card.",
//       optional: true,
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   flavour: "So there I was. Perfectly in control of the situation.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Michaela Martin",
//   number: 45,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527266,
//   },
//   rarity: "common",
// };
//
