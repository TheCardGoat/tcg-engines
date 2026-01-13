import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingMysteriousDuck: CharacterCard = {
  id: "ejj",
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Mysterious Duck",
  fullName: "Lena Sabrewing - Mysterious Duck",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 42,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3469f66d9abd9774d62799182860eab98d987ad2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const lenaSabrewingMysteriousDuck: LorcanitoCharacterCard = {
//   id: "ri6",
//   name: "Lena Sabrewing",
//   title: "Mysterious Duck",
//   characteristics: ["storyborn", "ally", "sorcerer"],
//   text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Mara Tango",
//   number: 42,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658457,
//   },
//   rarity: "common",
//   lore: 2,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "ARCANE CONNECTION",
//       text: "When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: ["character", "location"] },
//             { filter: "zone", value: "play" },
//             { filter: "status", value: "has-card-under" },
//           ],
//         },
//       ],
//       effects: [youGainLore(1)],
//     }),
//   ],
// };
//
