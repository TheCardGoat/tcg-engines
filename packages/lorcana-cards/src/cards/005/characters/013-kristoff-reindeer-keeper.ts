import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffReindeerKeeper: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1qs-1",
      text: "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      id: "1qs-2",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 13,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 9,
  externalIds: {
    ravensburger: "e249ebb7a0862363fa2c8ea6e2d6b7a453b278a5",
  },
  franchise: "Frozen",
  fullName: "Kristoff - Reindeer Keeper",
  id: "1qs",
  inkType: ["amber"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Kristoff",
  set: "005",
  strength: 3,
  text: "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Reindeer Keeper",
  willpower: 7,
};
