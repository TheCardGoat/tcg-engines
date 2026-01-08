import type { CharacterCard } from "@tcg/lorcana-types";

export const fredMascotByDay: CharacterCard = {
  id: "1h1",
  cardType: "character",
  name: "Fred",
  version: "Mascot by Day",
  fullName: "Fred - Mascot by Day",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "05562e0fc692cd80e28bb8a07a9507dde98c18a0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const fredMascotByDay: LorcanitoCharacterCard = {
//   id: "paj",
//   missingTestCase: true,
//   name: "Fred",
//   title: "Mascot by Day",
//   characteristics: ["hero", "storyborn"],
//   text: "**HOW COOL IS THAT** Whenever this character is challenged, gain 2 lore.",
//   type: "character",
//   abilities: [
//     whenChallenged({
//       name: "HOW COOL IS THAT",
//       text: "Whenever this character is challenged, gain 2 lore.",
//       effects: [youGainLore(2)],
//     }),
//   ],
//   flavour: ". . . but by night . . . I am also a school mascot.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Cam Kendell / Danielle Powers",
//   number: 75,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578186,
//   },
//   rarity: "common",
// };
//
