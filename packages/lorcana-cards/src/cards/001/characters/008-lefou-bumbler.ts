import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouBumbler: CharacterCard = {
  id: "9i4",
  cardType: "character",
  name: "LeFou",
  version: "Bumbler",
  fullName: "LeFou - Bumbler",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 8,
  inkable: true,
  externalIds: {
    ravensburger: "224000dbb0cebd90c025c1855cfddd5fe747691f",
  },
  abilities: [
    {
      id: "9i4-1",
      text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      name: "LOYAL",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
      },
      condition: {
        type: "has-named-character",
        name: "Gaston",
        controller: "you",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const lefouBumbler: LorcanitoCharacterCard = {
//   id: "eal",
//   name: "Lefou",
//   title: "Bumbler",
//   characteristics: ["storyborn", "ally"],
//   text: "**LOYAL** If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "Loyal",
//       text: "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
//       amount: 1,
//       conditions: [ifYouHaveCharacterNamed("Gaston")],
//     }),
//   ],
//   flavour: "You need a good toady to be a proper bad guy.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Andrey Chomak",
//   number: 8,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492738,
//   },
//   rarity: "uncommon",
// };
//
