import type { CharacterCard } from "@tcg/lorcana-types";

export const louieChillNephew: CharacterCard = {
  id: "1ac",
  cardType: "character",
  name: "Louie",
  version: "Chill Nephew",
  fullName: "Louie - Chill Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  externalIds: {
    ravensburger: "a70aef349e62cbf271e5f595be6b22aeb3d34724",
  },
  abilities: [
    {
      id: "1ac-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { louieChillNephew as louieChillNephewAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const louieChillNephew: LorcanitoCharacterCard = {
//   ...louieChillNephewAsOrig,
//   id: "pec",
//   reprints: [louieChillNephewAsOrig.id],
//   number: 140,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650075,
//   },
// };
//
