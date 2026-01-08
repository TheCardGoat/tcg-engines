import type { CharacterCard } from "@tcg/lorcana-types";

export const beastHardheaded: CharacterCard = {
  id: "m8v",
  cardType: "character",
  name: "Beast",
  version: "Hardheaded",
  fullName: "Beast - Hardheaded",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "BREAK When you play this character, you may banish chosen item.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 172,
  inkable: true,
  externalIds: {
    ravensburger: "502da9f4533484bfe02fb51fd83498e2d63e3275",
  },
  abilities: [
    {
      id: "m8v-1",
      text: "BREAK When you play this character, you may banish chosen item.",
      name: "BREAK",
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
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const beastHardheaded: LorcanitoCharacterCard = {
//   id: "sh5",
//   name: "Beast",
//   title: "Hardheaded",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**BREAK** When you play this character, you may banish chosen item card.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Break",
//       text: "When you play this character, you may banish chosen item card.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: '"She will never se me as anything... but a monster"',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Cookie",
//   number: 172,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508900,
//   },
//   rarity: "uncommon",
// };
//
