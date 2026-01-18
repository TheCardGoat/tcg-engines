import type { CharacterCard } from "@tcg/lorcana-types";
import { whenPlay } from "../../ability-helpers";

export const aladdinStreetRat: CharacterCard = {
  id: "ec0",
  cardType: "character",
  name: "Aladdin",
  version: "Street Rat",
  fullName: "Aladdin - Street Rat",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  externalIds: {
    ravensburger: "33a8b4eedbcab6c827f3eb65178e48bf29d42142",
  },
  abilities: [
    whenPlay("ec0-1", {
      name: "IMPROVISE",
      text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
      playedBy: "you",
      playedCard: "SELF",
      then: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    }),
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const aladdinStreetRat: LorcanitoCharacterCard = {
//   id: "d9z",
//
//   name: "Aladdin",
//   title: "Street Rat",
//   characteristics: ["hero", "storyborn"],
//   text: "**IMPROVISE** When you play this character each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "IMPROVISE",
//       text: "When you play this character each opponent loses 1 lore.",
//       effects: [
//         {
//           type: "lore",
//           modifier: "subtract",
//           amount: 1,
//           target: opponent,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "It can be hard to tell the difference between a diamond in the rough and someone who's just, well, rough.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Peter Brockhammer",
//   number: 105,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505947,
//   },
//   rarity: "common",
// };
//
