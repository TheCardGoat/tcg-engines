import type { CharacterCard } from "@tcg/lorcana-types";
import {
  discard,
  draw,
  optional,
  sequence,
  whenPlay,
} from "../../ability-helpers";

export const simbaFutureKing: CharacterCard = {
  id: "q21",
  cardType: "character",
  name: "Simba",
  version: "Future King",
  fullName: "Simba - Future King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  externalIds: {
    ravensburger: "5de9049716db6093e203ad3ba87b04894b400848",
  },
  abilities: [
    whenPlay("q21-1", {
      name: "GUESS WHAT?",
      text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
      playedBy: "you",
      playedCard: "SELF",
      then: optional(sequence(draw(1), discard(1, "CONTROLLER", true))),
    }),
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const simbaFutureKing: LorcanitoCharacterCard = {
//   id: "umu",
//   name: "Simba",
//   title: "Future King",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**GUESS WHAT?** When you play this character, you may draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       ...youMayDrawThenChooseAndDiscard,
//       name: "Guess What?",
//       text: "When you play this character, you may draw a card, then choose and discard a card.",
//       type: "resolution",
//     }),
//   ],
//   flavour: "I'm gonna be the best king the Pride Lands have ever seen!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 188,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502536,
//   },
//   rarity: "common",
// };
//
