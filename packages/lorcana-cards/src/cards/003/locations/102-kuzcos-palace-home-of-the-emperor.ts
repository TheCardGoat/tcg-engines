import type { LocationCard } from "@tcg/lorcana-types";

export const kuzcosPalaceHomeOfTheEmperor: LocationCard = {
  id: "aae",
  cardType: "location",
  name: "Kuzco's Palace",
  version: "Home of the Emperor",
  fullName: "Kuzco's Palace - Home of the Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "003",
  text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
  cost: 3,
  moveCost: 3,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2514f81045d67354a0f53e0031f8831ef08f7714",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kuzcosPalaceHomeOfTheEmperor: LorcanitoLocationCard = {
//   id: "d8d",
//   type: "location",
//   missingTestCase: true,
//   name: "Kuzco's Palace",
//   title: "Home of the Emperor",
//   characteristics: ["location"],
//   text: "**CITY WALLS** Whenever a character is challenged and banished while here, banish the challenging character.",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "City Walls",
//       text: "Whenever a character is challenged and banished while here, banish the challenging character.",
//       ability: whenChallengedAndBanished({
//         name: "City Walls",
//         text: "Whenever a character is challenged and banished while here, banish the challenging character.",
//         effects: [banishChallengingCharacter],
//       }),
//     }),
//   ],
//   flavour: "Sure it's a little small, but also it DOESN'T HAVE A POOL! −Kuzco",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 7,
//   lore: 1,
//   moveCost: 3,
//   illustrator: "Andreas Rocha",
//   number: 102,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538681,
//   },
//   rarity: "uncommon",
// };
//
