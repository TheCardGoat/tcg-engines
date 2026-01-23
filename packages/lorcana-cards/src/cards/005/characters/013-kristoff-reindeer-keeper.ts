import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffReindeerKeeper: CharacterCard = {
  id: "1qs",
  cardType: "character",
  name: "Kristoff",
  version: "Reindeer Keeper",
  fullName: "Kristoff - Reindeer Keeper",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  text: "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 9,
  strength: 3,
  willpower: 7,
  lore: 3,
  cardNumber: 13,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e249ebb7a0862363fa2c8ea6e2d6b7a453b278a5",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const kristoffReindeerKeeper: LorcanitoCharacterCard = {
//   id: "g08",
//   name: "Kristoff",
//   title: "Reindeer Keeper",
//   characteristics: ["dreamborn", "ally"],
//   text: "**SONG OF THE HERD** For each song card in your discard, you pay 1 {I} less to play this character. **Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     whenYouPlayThisForEachYouPayLess({
//       name: "Song of the Herd",
//       text: "For each song card in your discard, you pay 1 {I} less to play this character.",
//       amount: {
//         dynamic: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "action" },
//           { filter: "zone", value: "discard" },
//           { filter: "characteristics", value: ["song"] },
//         ],
//       },
//     }),
//   ],
//   colors: ["amber"],
//   cost: 9,
//   strength: 3,
//   willpower: 7,
//   lore: 3,
//   illustrator: "Jochem van Gool",
//   number: 13,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555242,
//   },
//   rarity: "rare",
// };
//
