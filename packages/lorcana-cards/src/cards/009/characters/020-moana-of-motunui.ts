import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaOfMotunui: CharacterCard = {
  id: "n94",
  cardType: "character",
  name: "Moana",
  version: "Of Motunui",
  fullName: "Moana - Of Motunui",
  inkType: ["amber"],
  franchise: "Moana",
  set: "009",
  text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
  cost: 5,
  strength: 1,
  willpower: 6,
  lore: 3,
  cardNumber: 20,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0253f6c8757d9698e3b28f4f973b3ccc6d5bd4ae",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { moanaOfMotunui as ogMoanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/014-moana-of-motunui";
//
// export const moanaOfMotunui: LorcanitoCharacterCard = {
//   ...ogMoanaOfMotunui,
//   id: "c9q",
//   reprints: [ogMoanaOfMotunui.id],
//   number: 20,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649968,
//   },
// };
//
