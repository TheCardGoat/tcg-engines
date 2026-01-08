import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  id: "j7u",
  cardType: "character",
  name: "Kuzco",
  version: "Temperamental Emperor",
  fullName: "Kuzco - Temperamental Emperor",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Ward** _(Opponents can",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 84,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kuzcoTemperamentalEmperor: LorcanitoCharacterCard = {
//   id: "j7u",
//   reprints: ["l2r"],
//   name: "Kuzco",
//   title: "Temperamental Emperor",
//   characteristics: ["storyborn", "king"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.",
//   type: "character",
//   abilities: [
//     whenChallengedAndBanished({
//       name: "No Touchy!",
//       text: "When this character is challenged and banished, you may banish the challenging character.",
//       optional: true,
//       effects: [banishChallengingCharacter],
//     }),
//     wardAbility,
//   ],
//   flavour:
//     "I asked for emerald and that is clearly jade! What is wrong with you people?",
//   colors: ["emerald"],
//   cost: 5,
//   strength: 2,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Grace Tran",
//   number: 84,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507284,
//   },
//   rarity: "rare",
// };
//
