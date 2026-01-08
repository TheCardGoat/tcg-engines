import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariNemesis: CharacterCard = {
  id: "1tc",
  cardType: "character",
  name: "Namaari",
  version: "Nemesis",
  fullName: "Namaari - Nemesis",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 118,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed2e0874b3a30681355b3da8236a6e1c0c6fe587",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const namaariNemesis: LorcanitoCharacterCard = {
//   id: "jyl",
//
//   name: "Namaari",
//   title: "Nemesis",
//   characteristics: ["storyborn", "villain", "princess"],
//   text: "**THIS SHOULDN'T TAKE LONG** {E}, Banish this character − Banish chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "This Shouldn't Take Long",
//       text: "{E}, Banish this character − Banish chosen character.",
//       costs: [{ type: "banish" }, { type: "exert" }],
//       effects: [
//         {
//           type: "banish",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "I don't need swords to beat you. They just make it more fun.",
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 118,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527757,
//   },
//   rarity: "super_rare",
// };
//
