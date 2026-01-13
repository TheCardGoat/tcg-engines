import type { CharacterCard } from "@tcg/lorcana-types";

export const mowgliManCub: CharacterCard = {
  id: "mea",
  cardType: "character",
  name: "Mowgli",
  version: "Man Cub",
  fullName: "Mowgli - Man Cub",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  text: "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "50b8acc5a7f2a8afabe9284202005b34f69e21e1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   DiscardEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// const nonCharacterCard: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: ["location", "item", "action"] },
//     { filter: "zone", value: "hand" },
//     { filter: "owner", value: "self" },
//   ],
// };
// const discardEffect: DiscardEffect = {
//   type: "discard",
//   amount: 1,
//   target: nonCharacterCard,
// };
//
// export const mowgliManCub: LorcanitoCharacterCard = {
//   id: "y0p",
//   name: "Mowgli",
//   title: "Man Cub",
//   characteristics: ["storyborn", "hero"],
//   text: "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Casey Robin",
//   number: 19,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659761,
//   },
//   rarity: "super_rare",
//   lore: 1,
//   abilities: [
//     whenYouPlayThis({
//       name: "HAVE A BETTER LOOK",
//       text: "When you play this character, your opponent discards a non-character card of their choice.",
//       responder: "opponent",
//       effects: [discardEffect],
//     }),
//     whenYouPlayThis({
//       name: "HAVE A BETTER LOOK",
//       text: "When you play this character, your opponent reveals their hand.",
//       effects: [opponentRevealHand],
//     }),
//   ],
// };
//
