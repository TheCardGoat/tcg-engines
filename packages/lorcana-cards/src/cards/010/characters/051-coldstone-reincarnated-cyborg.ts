import type { CharacterCard } from "@tcg/lorcana-types";

export const coldstoneReincarnatedCyborg: CharacterCard = {
  id: "1uk",
  cardType: "character",
  name: "Coldstone",
  version: "Reincarnated Cyborg",
  fullName: "Coldstone - Reincarnated Cyborg",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efe9bd3b196659d235f5f564d9d2c23aaa674bdb",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const coldstoneReincarnatedCyborg: LorcanitoCharacterCard = {
//   id: "vjz",
//   name: "Coldstone",
//   title: "Reincarnated Cyborg",
//   characteristics: ["storyborn", "ally", "gargoyle"],
//   text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
//   type: "character",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Cam Kendell / Alejandro Hernandez",
//   number: 51,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659762,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "THE CANTRIPS HAVE BEEN SPOKEN",
//       text: "When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 2 },
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["gargoyle"] },
//             { filter: "zone", value: "discard" },
//           ],
//         },
//       ],
//       effects: [youGainLore(2)],
//     }),
//   ],
//   lore: 2,
// };
//
