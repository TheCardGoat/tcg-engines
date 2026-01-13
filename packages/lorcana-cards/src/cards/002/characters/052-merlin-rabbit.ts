import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinRabbit: CharacterCard = {
  id: "11g",
  cardType: "character",
  name: "Merlin",
  version: "Rabbit",
  fullName: "Merlin - Rabbit",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 52,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "870378cfa4dc54ffbdf2cb2d60a56e9cf782a4ee",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const merlinRabbit: LorcanitoCharacterCard = {
//   id: "n83",
//
//   name: "Merlin",
//   title: "Rabbit",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**HOPPITY HIP!** When you play this character and when he leaves play, you may draw a card.",
//   type: "character",
//   abilities: whenPlayAndWhenLeaves({
//     name: "Hoppity Hip!",
//     text: "When you play this character and when he leaves play, you may draw a card.",
//     optional: true,
//     effects: [
//       {
//         type: "draw",
//         amount: 1,
//         target: self,
//       },
//     ],
//   }),
//   flavour: "It was turning out to be a bad hare day.",
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Michaela Martin",
//   number: 52,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520939,
//   },
//   rarity: "rare",
// };
//
