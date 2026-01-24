import type { ItemCard } from "@tcg/lorcana-types";

export const imperialBow: ItemCard = {
  id: "1li",
  cardType: "item",
  name: "Imperial Bow",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cded588bc643a1accb5d62c5fb7c6a8644f34ebf",
  },
  abilities: [
    {
      id: "1li-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 2,
        duration: "this-turn",
      },
      text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn.",
    },
  ],
};
