import type { CharacterCard } from "@tcg/lorcana-types";

export const theMatchmakerUnforgivingExpert: CharacterCard = {
  id: "fhg",
  cardType: "character",
  name: "The Matchmaker",
  version: "Unforgiving Expert",
  fullName: "The Matchmaker - Unforgiving Expert",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "007",
  text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "37ceefedfc5a4857cf51f3b75ec149712c62fdab",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { opponentLoseLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theMatchmakerUnforgivingExpert: LorcanitoCharacterCard = {
//   id: "wmb",
//   name: "The Matchmaker",
//   title: "Unforgiving Expert",
//   characteristics: ["storyborn"],
//   text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "You are a disgrace!",
//       text: "Whenever this character challenges another character, each opponent loses 1 lore.",
//       effects: [opponentLoseLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Brian Weiss",
//   number: 123,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618207,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
