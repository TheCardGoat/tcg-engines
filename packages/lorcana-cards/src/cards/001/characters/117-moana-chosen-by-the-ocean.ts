import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaChosenByTheOcean: CharacterCard = {
  id: "176",
  cardType: "character",
  name: "Moana",
  version: "Chosen by the Ocean",
  fullName: "Moana - Chosen by the Ocean",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 117,
  inkable: true,
  externalIds: {
    ravensburger: "045c9d82ec1f6de1fc7e93d21807204b5adf2985",
  },
  abilities: [
    {
      id: "176-1",
      text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
      name: "THIS IS NOT WHO YOU ARE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const moanChosenByTheOcean: LorcanitoCharacterCard = {
//   id: "w14",
//   name: "Moana",
//   title: "Chosen by the Ocean",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.",
//   type: "character",
//   illustrator: "Tanisha Cherislin",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       optional: true,
//       name: "THIS IS NOT WHO YOU ARE",
//       text: "When you play this character, you may banish chosen character named Te Ka.",
//       type: "resolution",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Te Ka" },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "You know who you are.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   number: 117,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508786,
//   },
//   rarity: "uncommon",
// };
//
