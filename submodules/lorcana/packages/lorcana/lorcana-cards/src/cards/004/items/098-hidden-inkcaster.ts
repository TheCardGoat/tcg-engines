import type { ItemCard } from "@tcg/lorcana-types";
import { hiddenInkcasterI18n } from "./098-hidden-inkcaster.i18n";

export const hiddenInkcaster: ItemCard = {
  id: "RqX",
  canonicalId: "ci_RqX",
  reprints: ["set4-098"],
  cardType: "item",
  name: "Hidden Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "004",
  cardNumber: 98,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_8bea9b8848964337b64e2ceed5c41302",
    tcgPlayer: 549437,
  },
  text: [
    {
      title: "FRESH INK",
      description: "When you play this item, draw a card.",
    },
    {
      title: "UNEXPECTED TREASURE",
      description: "All cards in your hand count as having {IW}.",
    },
  ],
  abilities: [
    {
      id: "RqX-1",
      name: "FRESH INK",
      text: "FRESH INK When you play this item, draw a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "RqX-2",
      name: "UNEXPECTED TREASURE",
      text: "UNEXPECTED TREASURE All cards in your hand count as having {IW}.",
      type: "static",
      effect: {
        type: "grant-hand-inkability",
      },
    },
  ],
  i18n: hiddenInkcasterI18n,
};
