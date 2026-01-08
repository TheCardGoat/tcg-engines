import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  id: "z5q",
  cardType: "character",
  name: "Captain Hook",
  version: "Captain of the Jolly Roger",
  fullName: "Captain Hook - Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c2l-1",
      text: "**CAPTAIN HOOK** You may return target character to their player's hand.",
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const captainHookCaptainOfTheJollyRoger: LorcanitoCharacterCard = {
//   id: "z5q",
//   reprints: ["kc5"],
//
//   name: "Captain Hook",
//   title: "Captain of the Jolly Roger",
//   characteristics: ["storyborn", "villain", "pirate", "captain"],
//   text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       optional: true,
//       name: "DOUBLE THE POWDER!",
//       text: "When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           exerted: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Fire the Cannons!" },
//               },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "A pretty sight, Mr. Smee. We’ll pot ’em like sitting \rducks.",
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Adrianne Gumaya",
//   number: 173,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493489,
//   },
//   rarity: "rare",
// };
//
