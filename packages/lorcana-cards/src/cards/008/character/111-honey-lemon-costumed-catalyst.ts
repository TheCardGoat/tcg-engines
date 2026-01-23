// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const honeyLemonCostumedCatalyst: LorcanitoCharacterCard = {
//   id: "g26",
//   name: "Honey Lemon",
//   title: "Costumed Catalyst",
//   characteristics: ["storyborn", "hero", "inventor"],
//   text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "LET'S DO THIS!",
//       text: "Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
//       optional: true,
//       hasShifted: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald", "sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Adam Ford",
//   number: 111,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631421,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
