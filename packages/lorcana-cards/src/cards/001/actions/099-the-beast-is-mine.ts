import type { ActionCard } from "@tcg/lorcana-types";

export const TheBeastIsMine: ActionCard = {
  id: "10f",
  cardType: "action",
  name: "The Beast is Mine!",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 99,
  inkable: true,
  externalIds: {
    ravensburger: "8488fbd0b43280a0577520d149097ebe9d751d8f",
  },
  abilities: [
    {
      id: "10f-1",
      text: "Chosen character gains Reckless during their next turn.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};
