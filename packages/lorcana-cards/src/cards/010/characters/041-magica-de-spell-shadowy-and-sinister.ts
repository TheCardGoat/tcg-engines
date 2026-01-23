import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellShadowyAndSinister: CharacterCard = {
  id: "1l8",
  cardType: "character",
  name: "Magica De Spell",
  version: "Shadowy and Sinister",
  fullName: "Magica De Spell - Shadowy and Sinister",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ce4abde68eebdb7140d8d4d00acb5b45784eb045",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const magicaDeSpellShadowyAndSinister: LorcanitoCharacterCard = {
//   id: "zaq",
//   name: "Magica De Spell",
//   title: "Shadowy and Sinister",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Brian Kesinger",
//   number: 41,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659459,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "DARK INCANTATION",
//       text: "When you play this character, you may shuffle a card from chosen player's discard into their deck.",
//       optional: true,
//       effects: [
//         {
//           type: "shuffle",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [{ filter: "zone", value: "discard" }],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
