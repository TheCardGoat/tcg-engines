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
  missingTests: true,
  externalIds: {
    ravensburger: "e249ebb7a0862363fa2c8ea6e2d6b7a453b278a5",
  },
  abilities: [
    {
      id: "1qs-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      id: "1qs-2",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
