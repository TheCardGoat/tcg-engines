import type { ItemCard } from "@tcg/lorcana-types";

export const imperialBow: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      id: "1li-1",
      text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn.",
      type: "activated",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "cded588bc643a1accb5d62c5fb7c6a8644f34ebf",
  },
  franchise: "Mulan",
  id: "1li",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Imperial Bow",
  set: "004",
  text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)",
};
