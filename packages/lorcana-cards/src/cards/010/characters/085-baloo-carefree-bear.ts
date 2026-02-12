import type { CharacterCard } from "@tcg/lorcana-types";

export const balooCarefreeBear: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1vf-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      id: "1vf-3",
      text: "- Each player draws a card.",
      type: "action",
    },
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_PLAYER",
        chosen: true,
      },
      id: "1vf-4",
      text: "- Each player chooses and discards a card.",
      type: "action",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "f304562c399fc869cd5b049872d5cbb222aac97d",
  },
  franchise: "Jungle Book",
  fullName: "Baloo - Carefree Bear",
  id: "1vf",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Baloo",
  set: "010",
  strength: 4,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Baloo.)\nROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.",
  version: "Carefree Bear",
  willpower: 5,
};
