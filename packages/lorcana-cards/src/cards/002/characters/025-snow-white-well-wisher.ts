import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteWellWisher: CharacterCard = {
  id: "1fh",
  cardType: "character",
  name: "Snow White",
  version: "Well Wisher",
  fullName: "Snow White - Well Wisher",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 25,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b98e167eead8609a7571bb2108cdad63d4cfcfdd",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { returnCharacterFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const snowWhiteWellWisher: LorcanitoCharacterCard = {
//   id: "xen",
//   name: "Snow White",
//   title: "Well Wisher",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Snow White.)_\n\n**WISHES COME TRUE** Whenever this character quests, you may return a character card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Wishes Come True",
//       text: "Whenever this character quests, you may return a character card from your discard to your hand.",
//       optional: true,
//       effects: [returnCharacterFromDiscardToHand],
//     }),
//     shiftAbility(4, "snow_white"),
//   ],
//   colors: ["amber"],
//   cost: 6,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Javi Salas",
//   number: 25,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527723,
//   },
//   rarity: "legendary",
// };
//
