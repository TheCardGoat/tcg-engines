import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseArtfulRogue: CharacterCard = {
  id: "dul",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Artful Rogue",
  fullName: "Mickey Mouse - Artful Rogue",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
      id: "dul-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseArtfulRogue: LorcanitoCharacterCard = {
//   id: "dul",
//   name: "Mickey Mouse",
//   title: "Artful Rogue",
//   characteristics: ["hero", "floodborn"],
//   type: "character",
//   text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.",
//   abilities: [
//     shiftAbility(5, "Mickey Mouse"),
//     wheneverPlays({
//       name: "Misdirection",
//       text: "Whenever you play an action, chosen opposing character can't quest during their next turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "next_turn",
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Quiet as a . . . well, you know.",
//   colors: ["emerald"],
//   cost: 7,
//   strength: 6,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Alex Accorsi",
//   number: 88,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506827,
//   },
//   rarity: "super_rare",
// };
//
