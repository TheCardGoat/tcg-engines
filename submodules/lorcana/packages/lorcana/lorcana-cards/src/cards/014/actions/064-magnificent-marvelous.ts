import type { ActionCard } from "@tcg/lorcana-types";
import { magnificentMarvelousI18n } from "./064-magnificent-marvelous.i18n";

export const magnificentMarvelous: ActionCard = {
  id: "ShR",
  canonicalId: "ci_ShR",
  slug: "lorcana-ci_ShR",
  printings: [
    {
      id: "set14-064",
      artId: "set14-064",
      setCode: "set14",
      collectorNumber: "64",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-064"],
  cardType: "action",
  name: "Magnificent, Marvelous",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 64,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_a3d1fc1b331c481dae12e390bfe5f396",
  },
  text: "Gain 2 lore. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Gain 2 lore. Draw a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-lore",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: magnificentMarvelousI18n,
};
