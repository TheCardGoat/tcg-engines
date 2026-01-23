import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGreediestOfAll: CharacterCard = {
  id: "9so",
  cardType: "character",
  name: "Prince John",
  version: "Greediest of All",
  fullName: "Prince John - Greediest of All",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 89,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "234f106f9cda1365ed6739c2c2de43bb307ce2a2",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverYourOpponentDiscardsOneOrMore } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const princeJohnGreediestOfAll: LorcanitoCharacterCard = {
//   id: "j3m",
//
//   name: "Prince John",
//   title: "Greediest of All",
//   characteristics: ["dreamborn", "villain", "prince"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**I SENTENCE YOU** Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
//   type: "character",
//   abilities: [
//     wheneverYourOpponentDiscardsOneOrMore({
//       name: "I Sentence You",
//       text: "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
//       optional: true,
//       effects: [drawACard],
//     }),
//     wardAbility,
//   ],
//   flavour: "Taxes! Taxes! Beautiful, lovely taxes!",
//   colors: ["emerald"],
//   cost: 3,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Koni",
//   number: 89,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522737,
//   },
//   rarity: "rare",
// };
//
