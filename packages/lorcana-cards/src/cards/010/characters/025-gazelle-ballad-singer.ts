import type { CharacterCard } from "@tcg/lorcana-types";

export const gazelleBalladSinger: CharacterCard = {
  id: "1kx",
  cardType: "character",
  name: "Gazelle",
  version: "Ballad Singer",
  fullName: "Gazelle - Ballad Singer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  text: "Singer 7 (This character counts as cost 7 to sing songs.)\nCROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.",
  cost: 5,
  strength: 3,
  willpower: 8,
  lore: 1,
  cardNumber: 25,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "05b30af245f5db3c3ab5472910df2f7879c362f0",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   MoveCardEffect,
// } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// const putSongCardFromDiscardToTopOfDeck: MoveCardEffect = {
//   type: "move",
//   to: "deck",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "zone", value: "discard" },
//       { filter: "owner", value: "self" },
//       { filter: "type", value: "action" },
//       { filter: "characteristics", value: ["song"] },
//     ],
//   },
// };
//
// export const gazelleBalladSinger: LorcanitoCharacterCard = {
//   id: "v45",
//   name: "Gazelle",
//   title: "Ballad Singer",
//   characteristics: ["dreamborn", "ally"],
//   text: "Singer 7 (This character counts as cost 7 to sing songs.)\nCROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.",
//   type: "character",
//   inkwell: false,
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 8,
//   illustrator: "Celeste Jamneck",
//   number: 25,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658446,
//   },
//   rarity: "rare",
//   abilities: [
//     singerAbility(7),
//     whenYouPlayThis({
//       name: "CROWD FAVORITE",
//       text: "When you play this character, you may put a song card from your discard on the top of your deck.",
//       optional: true,
//       effects: [putSongCardFromDiscardToTopOfDeck],
//     }),
//   ],
//   lore: 1,
// };
//
