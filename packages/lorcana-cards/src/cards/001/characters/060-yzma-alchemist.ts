import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaAlchemist: CharacterCard = {
  id: "drx",
  cardType: "character",
  name: "Yzma",
  version: "Alchemist",
  fullName: "Yzma - Alchemist",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**YOU",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yzmaAlchemist: LorcanitoCharacterCard = {
//   id: "drx",
//   name: "Yzma",
//   title: "Alchemist",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   text: "**YOU'RE EXCUSED** Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     }),
//   ],
//   flavour: '"When I want your opinion, I will give it to you!"',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Hadjie Joos",
//   number: 60,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492715,
//   },
//   rarity: "common",
// };
//
