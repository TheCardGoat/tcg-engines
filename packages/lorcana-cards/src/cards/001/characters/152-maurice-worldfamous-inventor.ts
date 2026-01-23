import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceWorldfamousInventor: CharacterCard = {
  id: "v0e",
  cardType: "character",
  name: "Maurice",
  version: "World-Famous Inventor",
  fullName: "Maurice - World-Famous Inventor",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  cardNumber: 152,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
      id: "v0e-1",
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
  classifications: ["Dreamborn", "Inventor", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   wheneverPlays,
//   wheneverQuests,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mauriceWorldFamousInventor: LorcanitoCharacterCard = {
//   id: "v0e",
//
//   name: "Maurice",
//   title: "World-Famous Inventor",
//   characteristics: ["dreamborn", "inventor", "mentor"],
//   text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Give it a try",
//       text: "Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 2,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "type", value: "item" }],
//           },
//         },
//       ],
//     }),
//     wheneverPlays({
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       optional: true,
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 2,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Alex Accorsi",
//   number: 152,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492126,
//   },
//   rarity: "rare",
// };
//
