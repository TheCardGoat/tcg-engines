import type { ItemCard } from "@tcg/lorcana-types";
import { inscrutableMapI18n } from "./099-inscrutable-map.i18n";

export const inscrutableMap: ItemCard = {
  id: "EeQ",
  canonicalId: "ci_EeQ",
  reprints: ["set10-099"],
  cardType: "item",
  name: "Inscrutable Map",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 99,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_9c1be117f6004fffaa9455c468395bf7",
    tcgPlayer: 658445,
  },
  text: [
    {
      title: "BACKTRACK",
      description:
        "{E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "lore",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "fpa-1",
      name: "BACKTRACK",
      text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: inscrutableMapI18n,
};
