import type { ItemCard } from "@tcg/lorcana-types";
import { potatoI18n } from "./105-potato.i18n";

export const potato: ItemCard = {
  id: "5EJ",
  canonicalId: "ci_5EJ",
  slug: "lorcana-ci_5EJ",
  printings: [
    {
      id: "set13-105",
      artId: "set13-105",
      setCode: "set13",
      collectorNumber: "105",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-105"],
  cardType: "item",
  name: "Potato",
  inkType: ["emerald"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 105,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_11e7ec08264e4f45b0859b62bb6db93e",
  },
  text: [
    {
      title: "FULL OF POTENTIAL",
      description: "This item enters play exerted.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "FULL OF POTENTIAL",
      text: "FULL OF POTENTIAL This item enters play exerted.",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    },
  ],
  i18n: potatoI18n,
};
