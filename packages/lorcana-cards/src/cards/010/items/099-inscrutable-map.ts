import type { ItemCard } from "@tcg/lorcana-types";

export const inscrutableMap: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        modifier: -1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "fpa-1",
      text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 99,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "3897aac04d62702fc584a4d0ce2ac7466a186d2c",
  },
  franchise: "Lorcana",
  id: "fpa",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Inscrutable Map",
  set: "010",
  text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
};
