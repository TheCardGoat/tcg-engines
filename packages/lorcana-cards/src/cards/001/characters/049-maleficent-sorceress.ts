import type { CharacterCard } from "@tcg/lorcana-types";
import { draw, optional, whenPlay } from "../../ability-helpers";

export const maleficentSorceress: CharacterCard = {
  id: "1la",
  cardType: "character",
  name: "Maleficent",
  version: "Sorceress",
  fullName: "Maleficent - Sorceress",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "CAST MY SPELL! When you play this character, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "cfeceefcaf48b610eb3bfdce490c108d8cc86302",
  },
  abilities: [
    whenPlay("1la-1", {
      name: "CAST MY SPELL!",
      text: "CAST MY SPELL! When you play this character, you may draw a card.",
      playedBy: "you",
      playedCard: "SELF",
      then: optional(draw(1)),
    }),
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   whenYouPlayMayDrawACard,
//   whenYouPlayThisCharAbility,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const maleficentSorceress: LorcanitoCharacterCard = {
//   id: "eb1",
//
//   name: "Maleficent",
//   title: "Sorceress",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**CAST MY SPELL** When you play this character, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       ...whenYouPlayMayDrawACard,
//       name: "Cast My Spell",
//       text: "When you play this character, you may draw a card.",
//     }),
//   ],
//   flavour:
//     "You dare challenge me? Fool, my magic is more \rpowerful than you could possibly imagine!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Valerio Buonfantino",
//   number: 49,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494103,
//   },
//   rarity: "common",
// };
//
