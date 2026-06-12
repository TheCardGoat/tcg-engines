import type { ItemCard } from "@tcg/lorcana-types";
import { beastsMirrorI18n } from "./201-beasts-mirror.i18n";

export const beastsMirror: ItemCard = {
  id: "g9u",
  canonicalId: "ci_j5a",
  reprints: ["set1-201", "set9-203"],
  cardType: "item",
  name: "Beast’s Mirror",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 201,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d23121463b6b482ab4af10faa55ba4ba",
    tcgPlayer: 650135,
  },
  text: [
    {
      title: "SHOW ME",
      description: "3, 3 {I} — If you have no cards in your hand, draw a card.",
    },
  ],
  abilities: [
    {
      id: "6wc-1",
      cost: {
        exert: true,
        ink: 3,
      },
      condition: {
        type: "resource-count",
        controller: "you",
        what: "cards-in-hand",
        comparison: "equal",
        value: 0,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "SHOW ME",
      type: "activated",
      text: "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.",
    },
  ],
  i18n: beastsMirrorI18n,
};
