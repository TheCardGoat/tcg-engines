import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineDesertWarrior: CharacterCard = {
  id: "160",
  cardType: "character",
  name: "Jasmine",
  version: "Desert Warrior",
  fullName: "Jasmine - Desert Warrior",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "004",
  text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 78,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9770423d3353e97f5163db0a1d9ae9050969620a",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// const smartManeuver: ResolutionAbility = {
//   type: "resolution",
//   name: "Smart Maneuver",
//   text: "When you play this character and each time she is challenged, each opponent chooses and discards a card.",
//   responder: "opponent",
//   effects: [discardACard],
// };
//
// export const jasmineDesertWarrior: LorcanitoCharacterCard = {
//   id: "g9b",
//   missingTestCase: true,
//   name: "Jasmine",
//   title: "Desert Warrior",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**SMART MANEUVER** When you play this character and each time she is challenged, each opponent chooses and discards a card.",
//   type: "character",
//   abilities: [
//     smartManeuver,
//     whenChallenged({
//       ...smartManeuver,
//     }),
//   ],
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Alice Pisoni",
//   number: 78,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550577,
//   },
//   rarity: "rare",
// };
//
