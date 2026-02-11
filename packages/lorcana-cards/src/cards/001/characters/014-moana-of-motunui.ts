import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaOfMotunui: CharacterCard = {
  abilities: [],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Moana - Of Motunui",
  id: "swj",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  name: "Moana",
  set: "001",
  strength: 1,
  text: "**WE CAN FIX IT** Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can",
  version: "Of Motunui",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const moanaOfMotunui: LorcanitoCharacterCard = {
//   Id: "swj",
//   Reprints: ["c9q"],
//   Name: "Moana",
//   Title: "Of Motunui",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**WE CAN FIX IT** Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Optional: true,
//       Name: "We Can Fix It",
//       Text: "Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
//       Effects: readyAndCantQuest({
//         Type: "card",
//         Value: "all",
//         ExcludeSelf: true,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["princess"] },
//           { filter: "status", value: "exerted" },
//         ],
//       }),
//     }),
//   ],
//   Flavour:
//     "I am Moana of Motunui. You will board my boat, sail across the sea, and restore the heart of Te Fiti.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 1,
//   Willpower: 6,
//   Lore: 3,
//   Illustrator: "Nicholas Kole",
//   Number: 14,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492739,
//   },
//   Rarity: "rare",
// };
//
