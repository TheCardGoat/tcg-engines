import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelGiftedWithHealing: CharacterCard = {
  id: "kro",
  cardType: "character",
  name: "Rapunzel",
  version: "Gifted with Healing",
  fullName: "Rapunzel - Gifted with Healing",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "kro-1",
      text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 3,
            upTo: true,
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// export const rapunzelGiftedWithHealing: LorcanitoCharacterCard = {
//   id: "kro",
//   name: "Rapunzel",
//   title: "Gifted with Healing",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       name: "GLEAM AND GLOW",
//       text: "When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
//       type: "resolution",
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           // THIS IS HACKY AS A TEMPORARY WORKAROUND. -1 REPRESENTS DYNAMIC HEAL BASED VALUE
//           subEffect: {
//             type: "draw",
//             amount: -1,
//             target: self,
//           },
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jochem Van Gool",
//   number: 18,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506836,
//   },
//   rarity: "legendary",
// };
//
