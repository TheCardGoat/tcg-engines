// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const hadesLordOfTheUnderworld: LorcanitoCharacterCard = {
//   id: "dme",
//   missingTestCase: true,
//   name: "Hades",
//   title: "Lord of the Dead",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
//   type: "character",
//   abilities: [
//     whenYourOtherCharactersIsBanished({
//       name: "Soul Collector",
//       text: "Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
//       conditions: [{ type: "during-turn", value: "opponent" }],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 2,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Denny Minonne",
//   number: 36,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593009,
//   },
//   rarity: "rare",
// };
//
