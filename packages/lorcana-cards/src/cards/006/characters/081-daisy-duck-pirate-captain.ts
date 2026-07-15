import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckPirateCaptain: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "zzu-1",
      name: "DISTANT SHORES",
      text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "81bb233190edd5db1df45cfb55355201fc429a34",
  },
  fullName: "Daisy Duck - Pirate Captain",
  id: "zzu",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Daisy Duck",
  set: "006",
  strength: 3,
  text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
  version: "Pirate Captain",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverACharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const daisyDuckPirateCaptain: LorcanitoCharacterCard = {
//   Id: "zbi",
//   Name: "Daisy Duck",
//   Title: "Pirate Captain",
//   Characteristics: ["dreamborn", "hero", "pirate", "captain"],
//   Text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
//   Type: "character",
//   Abilities: [
//     WheneverACharacterQuests({
//       Name: "Distant Shores",
//       Text: "Whenever one of your Pirate characters quests while at a location, draw a card.",
//       Optional: false,
//       Effects: [drawACard],
//       CharacterFilter: [
//         { filter: "characteristics", value: ["pirate"] },
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "play" },
//         { filter: "status", value: "at-location" },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Jochem van Gool",
//   Number: 81,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 592039,
//   },
//   Rarity: "super_rare",
// };
//
