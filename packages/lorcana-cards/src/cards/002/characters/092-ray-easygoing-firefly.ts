import type { CharacterCard } from "@tcg/lorcana-types";

export const rayEasygoingFirefly: CharacterCard = {
  id: "1bk",
  cardType: "character",
  name: "Ray",
  version: "Easygoing Firefly",
  fullName: "Ray - Easygoing Firefly",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 92,
  inkable: true,
  externalIds: {
    ravensburger: "ab6c67ceb00eb3d0444aff79e47e18bd4a08a536",
  },
  abilities: [
    {
      id: "1bk-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const rayEasygoingFirefly: LorcanitoCharacterCard = {
//   id: "fdk",
//   name: "Ray",
//   title: "Easygoing Firefly",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "He may be hard to follow, but his heart isn't.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Filipe Laurentino",
//   number: 92,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527250,
//   },
//   rarity: "common",
// };
//
