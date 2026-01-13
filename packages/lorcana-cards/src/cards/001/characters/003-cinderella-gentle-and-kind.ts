import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaGentleAndKind: CharacterCard = {
  id: "qil",
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  fullName: "Cinderella - Gentle and Kind",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 3,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "qil-1",
      text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cinderellaGentleAndKind: LorcanitoCharacterCard = {
//   id: "qil",
//   reprints: ["xks"],
//   name: "Cinderella",
//   title: "Gentle and Kind",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
//   type: "character",
//   illustrator: "Javier Salas",
//   abilities: [
//     {
//       type: "activated",
//       name: "A WONDERFUL DREAM",
//       text: "{E}− Remove up to 3 damage from chosen Princess character.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["princess"] },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "static",
//       ability: "singer",
//       value: 5,
//       text: "**Singer** 5 _(This character counts as cost 4 to sing songs.)_",
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   number: 3,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508692,
//   },
//   rarity: "uncommon",
// };
//
