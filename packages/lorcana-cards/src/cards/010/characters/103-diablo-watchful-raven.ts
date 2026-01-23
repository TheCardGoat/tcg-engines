import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloWatchfulRaven: CharacterCard = {
  id: "p96",
  cardType: "character",
  name: "Diablo",
  version: "Watchful Raven",
  fullName: "Diablo - Watchful Raven",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "010",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 103,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "5b0536f8713264096a32c9d14cc707b4254f2cb4",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const diabloWatchfulRaven: LorcanitoCharacterCard = {
//   id: "tt8",
//   name: "Diablo",
//   title: "Watchful Raven",
//   characteristics: ["storyborn", "ally"],
//   text: "Be careful when gathering herbs in the Inkwell Caverns. You never know who's watching. —Hana's Herborium",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Giulia Iacopini / Livio Cacciatore",
//   number: 103,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658380,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
