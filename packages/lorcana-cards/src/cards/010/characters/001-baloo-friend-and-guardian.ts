import type { CharacterCard } from "@tcg/lorcana-types";

export const balooFriendAndGuardian: CharacterCard = {
  id: "qnc",
  cardType: "character",
  name: "Baloo",
  version: "Friend and Guardian",
  fullName: "Baloo - Friend and Guardian",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 1,
  inkable: true,
  externalIds: {
    ravensburger: "600b15a6131a9729bcbb09477b1417d11e96769f",
  },
  abilities: [
    {
      id: "qnc-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "qnc-2",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   bodyguardAbility,
//   supportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const balooFriendAndGuardian: LorcanitoCharacterCard = {
//   id: "oox",
//   name: "Baloo",
//   title: "Friend and Guardian",
//   characteristics: ["storyborn", "ally"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 3,
//   willpower: 8,
//   illustrator: "Amanda Duarte / Julio Cesar",
//   number: 1,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659178,
//   },
//   rarity: "rare",
//   abilities: [bodyguardAbility, supportAbility],
//   lore: 2,
// };
//
