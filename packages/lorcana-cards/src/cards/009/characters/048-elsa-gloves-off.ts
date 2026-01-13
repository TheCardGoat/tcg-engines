import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaGlovesOff: CharacterCard = {
  id: "77o",
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  fullName: "Elsa - Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  text: "Challenger +3 (While challenging, this character gets +3 {S})",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  externalIds: {
    ravensburger: "19ff66fcdff2f3666e276f89a192f746b49b256b",
  },
  abilities: [
    {
      id: "77o-1",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
      text: "Challenger +3",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { elsaGlovesOff as ogElsaGlovesOff } from "@lorcanito/lorcana-engine/cards/002/characters/039-elsa-gloves-off";
//
// export const elsaGlovesOff: LorcanitoCharacterCard = {
//   ...ogElsaGlovesOff,
//   id: "b83", // New ID for this card
//   reprints: [ogElsaGlovesOff.id],
//   number: 48,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649992,
//   },
// };
//
