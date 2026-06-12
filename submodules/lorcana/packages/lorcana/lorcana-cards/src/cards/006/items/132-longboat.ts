import type { ItemCard } from "@tcg/lorcana-types";
import { longboatI18n } from "./132-longboat.i18n";

export const longboat: ItemCard = {
  id: "LxE",
  canonicalId: "ci_LxE",
  reprints: ["set6-132"],
  cardType: "item",
  name: "Longboat",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 132,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3f429b4816d0421cb951261fa3552a95",
    tcgPlayer: 592009,
  },
  text: [
    {
      title: "TAKE IT FOR A SPIN 2",
      description:
        "{I} — Chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 2,
      },
      effect: {
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        duration: "until-start-of-next-turn",
        type: "gain-keyword",
      },
      id: "1wi-1",
      name: "TAKE IT FOR A SPIN",
      text: "TAKE IT FOR A SPIN 2 {I} — Chosen character of yours gains Evasive until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: longboatI18n,
};
