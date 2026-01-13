import type { CharacterCard } from "@tcg/lorcana-types";

export const scarShamelessFirebrand: CharacterCard = {
  id: "mm7",
  cardType: "character",
  name: "Scar",
  version: "Shameless Firebrand",
  fullName: "Scar - Shameless Firebrand",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
      id: "mm7-1",
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
  classifications: ["Floodborn", "Villain", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const scarShamelessFirebrand: LorcanitoCharacterCard = {
//   id: "mm7",
//   name: "Scar",
//   title: "Shameless Firebrand",
//   characteristics: ["floodborn", "villain", "king"],
//   text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(6, "Scar"),
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "ROUSING SPEECH",
//       text: "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn",
//       effects: readyAndCantQuest({
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "cost",
//             comparison: { operator: "lte", value: 3 },
//           },
//         ],
//       }),
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 8,
//   strength: 6,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 123,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507467,
//   },
//   rarity: "rare",
// };
//
