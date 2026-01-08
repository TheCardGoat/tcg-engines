import type { CharacterCard } from "@tcg/lorcana-types";

export const guntherInteriorDesigner: CharacterCard = {
  id: "1ig",
  cardType: "character",
  name: "Gunther",
  version: "Interior Designer",
  fullName: "Gunther - Interior Designer",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "004",
  text: "SAD-EYED PUPPY When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c451b24038a7044d5cd28931bdaafb434a04c04d",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const guntherInteriorDesigner: LorcanitoCharacterCard = {
//   id: "n20",
//   missingTestCase: true,
//   name: "Gunther",
//   title: "Interior Designer",
//   characteristics: ["dreamborn", "ally"],
//   text: "**SAD-EYED PUPPY** When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
//   type: "character",
//   abilities: [
//     whenChallengedAndBanished({
//       name: "Sad-Eyed Puppy",
//       text: "When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
//       responder: "opponent",
//       effects: [returnCardToHand(chosenCharacterOfYours)],
//     }),
//   ],
//   flavour: "I hate to cover this trap door. It really pulls the room together!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Anderson Mahanski",
//   number: 72,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547774,
//   },
//   rarity: "common",
// };
//
