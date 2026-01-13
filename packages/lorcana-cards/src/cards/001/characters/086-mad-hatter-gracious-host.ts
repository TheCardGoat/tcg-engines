import type { CharacterCard } from "@tcg/lorcana-types";

export const madHatterGraciousHost: CharacterCard = {
  id: "hej",
  cardType: "character",
  name: "Mad Hatter",
  version: "Gracious Host",
  fullName: "Mad Hatter - Gracious Host",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "001",
  text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 86,
  inkable: true,
  externalIds: {
    ravensburger: "3eb9c2ef04530dc057f7085a82915ead29d51e4d",
  },
  abilities: [
    {
      id: "hej-1",
      type: "triggered",
      name: "TEA PARTY",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
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
      text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// export const madHatterGraciousHost: LorcanitoCharacterCard = {
//   id: "xw3",
//
//   name: "Mad Hatter",
//   title: "Gracious Host",
//   characteristics: ["storyborn"],
//   text: "**TEA PARTY** Whenever this character is challenged, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenChallenged({
//       name: "Tea Party",
//       text: "Whenever this character is challenged, you may draw a card.",
//       optional: true,
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           } as PlayerEffectTarget,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Mad Hatter: Would you like a little more tea? \nAlice: I haven't had any yet, so I can't very well take more.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 2,
//   willpower: 4,
//   lore: 3,
//   illustrator: "R. La Barbera / L. Giammichele",
//   number: 86,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508770,
//   },
//   rarity: "uncommon",
// };
//
