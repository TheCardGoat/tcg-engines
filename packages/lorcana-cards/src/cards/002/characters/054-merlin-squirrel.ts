import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSquirrel: CharacterCard = {
  id: "1qe",
  cardType: "character",
  name: "Merlin",
  version: "Squirrel",
  fullName: "Merlin - Squirrel",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 54,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0e05765aeabd996bd2063c5bcdb4298b19829c8",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const merlinSquirrel: LorcanitoCharacterCard = {
//   id: "lvm",
//
//   name: "Merlin",
//   title: "Squirrel",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**LOOK BEFORE YOU LEAP** When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: whenPlayAndWhenLeaves({
//     name: "Look Before You Leap",
//     text: "When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//     effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//   }),
//   flavour: "You can’t always trust to luck, boy.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 54,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522209,
//   },
//   rarity: "common",
// };
//
