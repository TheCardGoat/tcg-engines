import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaOfMotunui: CharacterCard = {
  id: "swj",
  cardType: "character",
  name: "Moana",
  version: "Of Motunui",
  fullName: "Moana - Of Motunui",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**WE CAN FIX IT** Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can",
  cost: 5,
  strength: 1,
  willpower: 6,
  lore: 3,
  cardNumber: 14,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const moanaOfMotunui: LorcanitoCharacterCard = {
//   id: "swj",
//   reprints: ["c9q"],
//   name: "Moana",
//   title: "Of Motunui",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**WE CAN FIX IT** Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       optional: true,
//       name: "We Can Fix It",
//       text: "Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
//       effects: readyAndCantQuest({
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["princess"] },
//           { filter: "status", value: "exerted" },
//         ],
//       }),
//     }),
//   ],
//   flavour:
//     "I am Moana of Motunui. You will board my boat, sail across the sea, and restore the heart of Te Fiti.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 1,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Nicholas Kole",
//   number: 14,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492739,
//   },
//   rarity: "rare",
// };
//
