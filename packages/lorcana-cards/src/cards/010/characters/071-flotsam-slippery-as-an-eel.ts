import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamSlipperyAsAnEel: CharacterCard = {
  id: "3ma",
  cardType: "character",
  name: "Flotsam",
  version: "Slippery as an Eel",
  fullName: "Flotsam - Slippery as an Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 71,
  inkable: true,
  externalIds: {
    ravensburger: "0d0b8280324df86a9fb785909a5ba25e5422f783",
  },
  abilities: [
    {
      id: "3ma-1",
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
// export const flotsamSlipperyAsAnEel: LorcanitoCharacterCard = {
//   id: "qyc",
//   name: "Flotsam",
//   title: "Slippery as an Eel",
//   characteristics: ["storyborn", "ally"],
//   text: "Evasive",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 4,
//   willpower: 2,
//   illustrator: "Ricardo Caria",
//   number: 71,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659421,
//   },
//   rarity: "common",
//   abilities: [evasiveAbility],
//   lore: 1,
// };
//
