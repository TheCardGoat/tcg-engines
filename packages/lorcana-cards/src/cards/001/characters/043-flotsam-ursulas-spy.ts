import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamUrsulasSpy: CharacterCard = {
  id: "4d0",
  cardType: "character",
  name: "Flotsam",
  version: "Ursula’s Spy",
  fullName: "Flotsam - Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nDEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 43,
  inkable: false,
  externalIds: {
    ravensburger: "0fb84ba893dbb130cedf653b49ff8e2427440270",
  },
  abilities: [
    {
      id: "4d0-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "4d0-2",
      text: "DEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
      name: "DEXTEROUS LUNGE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   rushAbility,
//   yourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const flotsamUrsulaSpy: LorcanitoCharacterCard = {
//   id: "apr",
//
//   name: "Flotsam",
//   title: "Ursula's Spy",
//   characteristics: ["storyborn", "ally"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\nc",
//   type: "character",
//   abilities: [
//     rushAbility,
//     yourCharactersNamedGain({
//       name: "Jetsam",
//       ability: rushAbility,
//     }),
//   ],
//   flavour: "We know someone who can help you . . . for a price.",
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Luis Huerta",
//   number: 43,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503318,
//   },
//   rarity: "rare",
// };
//
