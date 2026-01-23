import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinShapeshifter: CharacterCard = {
  id: "fck",
  cardType: "character",
  name: "Merlin",
  version: "Shapeshifter",
  fullName: "Merlin - Shapeshifter",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3751caafb6f13697fa71e20453c85eabe3a49ed4",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { oneOfYourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverIsReturnedToHand } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const merlinShapeshifter: LorcanitoCharacterCard = {
//   id: "lcu",
//   name: "Merlin",
//   title: "Shapeshifter",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**BATTLE OF WITS** Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverIsReturnedToHand({
//       name: "Battle of Wits",
//       text: "Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
//       target: oneOfYourOtherCharacters,
//       // from: "play",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Oh, blast it all−I can’t make up my mind.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 53,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516329,
//   },
//   rarity: "rare",
// };
//
