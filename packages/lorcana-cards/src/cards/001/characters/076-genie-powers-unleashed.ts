import type { CharacterCard } from "@tcg/lorcana-types";

export const geniePowersUnleashed: CharacterCard = {
  id: "dgz",
  cardType: "character",
  name: "Genie",
  version: "Powers Unleashed",
  fullName: "Genie - Powers Unleashed",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
  cost: 8,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 76,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
      id: "dgz-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const geniePowerUnleashed: LorcanitoCharacterCard = {
//   id: "dgz",
//   name: "Genie",
//   title: "Powers Unleashed",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
//   type: "character",
//   illustrator: "Javier Salas",
//   abilities: [
//     wheneverQuests({
//       name: "Phenomenal Cosmic Power",
//       text: "Whenever this character quests, you may play an action with cost 5 or less for free.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "play",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "type", value: "action" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//     evasiveAbility,
//     shiftAbility(6, "Genie"),
//   ],
//   colors: ["emerald"],
//   cost: 8,
//   strength: 3,
//   willpower: 5,
//   lore: 3,
//   number: 76,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508766,
//   },
//   rarity: "rare",
// };
//
