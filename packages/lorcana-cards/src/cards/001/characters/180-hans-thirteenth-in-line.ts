import type { CharacterCard } from "@tcg/lorcana-types";

export const hansThirteenthInLine: CharacterCard = {
  id: "1ro",
  cardType: "character",
  name: "Hans",
  version: "Thirteenth in Line",
  fullName: "Hans - Thirteenth in Line",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "001",
  text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  externalIds: {
    ravensburger: "e57dd5df690f5083848c5ffe191627af870b3985",
  },
  abilities: [
    {
      id: "1ro-1",
      text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
      name: "STAGE A LITTLE ACCIDENT",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hansThirteenthInLine: LorcanitoCharacterCard = {
//   id: "p2r",
//   name: "Hans",
//   title: "Thirteenth in Line",
//   characteristics: ["storyborn", "villain", "prince"],
//   text: "**STAGE LITTLE ACCIDENT** Whenever this character quests, you may deal 1 damage to chosen character.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "STAGE LITTLE ACCIDENT",
//       text: "Whenever this character quests, you may deal 1 damage to chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Tired of being last, he decided to cut the line.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 180,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506823,
//   },
//   rarity: "super_rare",
// };
//
