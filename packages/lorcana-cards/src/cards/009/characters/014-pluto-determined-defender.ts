import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoDeterminedDefender: CharacterCard = {
  id: "zh2",
  cardType: "character",
  name: "Pluto",
  version: "Determined Defender",
  fullName: "Pluto - Determined Defender",
  inkType: ["amber"],
  set: "009",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Pluto.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nGUARD DOG At the start of your turn, remove up to 3 damage from this character.",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 14,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7fd9befad39f19fd09370a0976c47a9fe3a3593d",
  },
  abilities: [
    {
      id: "zh2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5 {I}",
    },
    {
      id: "zh2-2",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "zh2-3",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "self",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "GUARD DOG At the start of your turn, remove up to 3 damage from this character.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
