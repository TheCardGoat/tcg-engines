import type { ItemCard } from "@tcg/lorcana-types";

export const inscrutableMap: ItemCard = {
  id: "fpa",
  cardType: "item",
  name: "Inscrutable Map",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
  cost: 3,
  cardNumber: 99,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3897aac04d62702fc584a4d0ce2ac7466a186d2c",
  },
  abilities: [
    {
      id: "fpa-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
    },
  ],
};
