import type { CharacterCard } from "@tcg/lorcana-types";

export const philoctetesTrainerOfHeroes: CharacterCard = {
  id: "1g8",
  cardType: "character",
  name: "Philoctetes",
  version: "Trainer of Heroes",
  fullName: "Philoctetes - Trainer of Heroes",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  externalIds: {
    ravensburger: "bc5a3301196e31a727216ba5bd0ecf0f0dcae69a",
  },
  abilities: [
    {
      id: "1g8-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const philoctetes: LorcanitoCharacterCard = {
//   id: "z5i",
//
//   name: "Philoctetes",
//   title: "Trainer of Heroes",
//   characteristics: ["storyborn", "mentor"],
//   text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour: "Ya gotta be the best to train the best. And I train the best!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 3,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 156,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508875,
//   },
//   rarity: "common",
// };
//
