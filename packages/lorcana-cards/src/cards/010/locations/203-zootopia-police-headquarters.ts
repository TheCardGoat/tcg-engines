import type { LocationCard } from "@tcg/lorcana-types";

export const zootopiaPoliceHeadquarters: LocationCard = {
  id: "98y",
  cardType: "location",
  name: "Zootopia",
  version: "Police Headquarters",
  fullName: "Zootopia - Police Headquarters",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 203,
  inkable: true,
  externalIds: {
    ravensburger: "2155a20775327ef31c200c31abc6084494a2cc46",
  },
  abilities: [
    {
      id: "98y-1",
      text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
      name: "NEW INFORMATION",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const zootopiaPoliceHeadquarters: LorcanitoLocationCard = {
//   id: "moe",
//   name: "Zootopia",
//   title: "Police Headquarters",
//   characteristics: ["location"],
//   text: "NEW INFORMATION Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
//   type: "location",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   willpower: 4,
//   illustrator: "",
//   number: 203,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659415,
//   },
//   rarity: "super_rare",
//   moveCost: 1,
//   lore: 1,
//   abilities: [
//     whenYouMoveACharacterHere({
//       name: "NEW INFORMATION",
//       text: "Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
//       optional: true,
//       oncePerTurn: true,
//       conditions: [
//         { type: "first-time-move-to-location" },
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       resolveEffectsIndividually:
//         youMayDrawThenChooseAndDiscard.resolveEffectsIndividually,
//       effects: youMayDrawThenChooseAndDiscard.effects,
//     }),
//   ],
// };
//
