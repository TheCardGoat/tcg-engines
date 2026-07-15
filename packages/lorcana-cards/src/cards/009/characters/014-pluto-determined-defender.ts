import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoDeterminedDefender: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "zh2-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      id: "zh2-2",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "self",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "zh2-3",
      text: "GUARD DOG At the start of your turn, remove up to 3 damage from this character.",
      type: "action",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "7fd9befad39f19fd09370a0976c47a9fe3a3593d",
  },
  fullName: "Pluto - Determined Defender",
  id: "zh2",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pluto",
  set: "009",
  strength: 3,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Pluto.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nGUARD DOG At the start of your turn, remove up to 3 damage from this character.",
  version: "Determined Defender",
  willpower: 8,
};
