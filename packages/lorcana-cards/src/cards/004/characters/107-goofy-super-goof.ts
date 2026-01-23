import type { CharacterCard } from "@tcg/lorcana-types";

export const goofySuperGoof: CharacterCard = {
  id: "1n2",
  cardType: "character",
  name: "Goofy",
  version: "Super Goof",
  fullName: "Goofy - Super Goof",
  inkType: ["ruby"],
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)\nSUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 107,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d68e1198d53d0e18c6b1f08b1308f124fed05118",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goofySuperGoof: LorcanitoCharacterCard = {
//   id: "f8o",
//   name: "Goofy",
//   title: "Super Goof",
//   characteristics: ["hero", "storyborn"],
//   text: "**Rush** _(This character can challenge the turn they're played)_\n\n**SUPER PEANUT POWERS** Whenever this character challenges another character, gain 2 lore",
//   type: "character",
//   abilities: [
//     rushAbility,
//     wheneverChallengesAnotherChar({
//       name: "**SUPER PEANUT POWERS**",
//       text: "Whenever this character challenges another character, gain 2 lore.",
//       effects: [youGainLore(2)],
//     }),
//   ],
//   flavour: "Never underestimate the power of a Goof.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Justin Runfola",
//   number: 107,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543912,
//   },
//   rarity: "rare",
// };
//
