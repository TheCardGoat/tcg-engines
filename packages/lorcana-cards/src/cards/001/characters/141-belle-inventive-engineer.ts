import type { CharacterCard } from "@tcg/lorcana-types";

export const belleInventiveEngineer: CharacterCard = {
  id: "vuf",
  cardType: "character",
  name: "Belle",
  version: "Inventive Engineer",
  fullName: "Belle - Inventive Engineer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      id: "vuf-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Inventor", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// export const belleInventive: LorcanitoCharacterCard = {
//   id: "vuf",
//   reprints: ["siv"],
//   name: "Belle",
//   title: "Inventive Engineer",
//   characteristics: ["hero", "dreamborn", "inventor", "princess"],
//   text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Tinker",
//       text: "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "type", value: "item" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "A little ingenuity and a lot of heart will take you far in this world.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Gabriel Romero / Pix Smith",
//   number: 141,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492727,
//   },
//   rarity: "uncommon",
// };
//
