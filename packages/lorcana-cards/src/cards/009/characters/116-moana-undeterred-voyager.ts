import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaUndeterredVoyager: CharacterCard = {
  id: "d5c",
  cardType: "character",
  name: "Moana",
  version: "Undeterred Voyager",
  fullName: "Moana - Undeterred Voyager",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 116,
  inkable: true,
  externalIds: {
    ravensburger: "2f63375cd85e72b1c7c5774f2318433677ff7601",
  },
  abilities: [
    {
      id: "d5c-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { moanaUndeterredVoyager as ogMoanaUndeterredVoyager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const moanaUndeterredVoyager: LorcanitoCharacterCard = {
//   ...ogMoanaUndeterredVoyager,
//   id: "n3t",
//   reprints: [ogMoanaUndeterredVoyager.id],
//   number: 116,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650052,
//   },
// };
//
