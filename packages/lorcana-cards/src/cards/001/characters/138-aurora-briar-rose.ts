import type { CharacterCard } from "@tcg/lorcana-types";
import { whenPlay } from "../../ability-helpers";

export const auroraBriarRose: CharacterCard = {
  id: "v54",
  cardType: "character",
  name: "Aurora",
  version: "Briar Rose",
  fullName: "Aurora - Briar Rose",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  externalIds: {
    ravensburger: "703d2d0c9e63fb69fed427dac99aa1f1f589898f",
  },
  abilities: [
    whenPlay("v54-1", {
      name: "DISARMING BEAUTY",
      text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
      playedBy: "you",
      playedCard: "SELF",
      then: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    }),
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const auroraBriarRose: LorcanitoCharacterCard = {
//   id: "du8",
//
//   name: "Aurora",
//   title: "Briar Rose",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**DISTURBING BEAUTY** When you play this character, chosen character gets -2 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "DISTURBING BEAUTY",
//       text: "When you play this character, chosen character gets -2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "There was something strange about that voice. Too beautiful to be real . . .",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Rosalia Radosti",
//   number: 138,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508809,
//   },
//   rarity: "common",
// };
//
