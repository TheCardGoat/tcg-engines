import type { CharacterCard } from "@tcg/lorcana-types";

export const hermesHarriedMessenger: CharacterCard = {
  id: "17j",
  cardType: "character",
  name: "Hermes",
  version: "Harried Messenger",
  fullName: "Hermes - Harried Messenger",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  externalIds: {
    ravensburger: "9ce36fa3156e783f9c693a2e872e588419f40862",
  },
  abilities: [
    {
      id: "17j-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const hermesHarriedMessenger: LorcanitoCharacterCard = {
//   id: "n57",
//   name: "Hermes",
//   title: "Harried Messenger",
//   characteristics: ["storyborn", "deity"],
//   text: "Rush (This character can challenge the turn they're played.)",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Rodrigo Camilo",
//   number: 112,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658878,
//   },
//   rarity: "common",
//   abilities: [rushAbility],
//   lore: 1,
// };
//
