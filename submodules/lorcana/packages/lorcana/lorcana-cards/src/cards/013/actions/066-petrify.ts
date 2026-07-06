import type { ActionCard } from "@tcg/lorcana-types";
import { petrifyI18n } from "./066-petrify.i18n";

export const petrify: ActionCard = {
  id: "eVx",
  canonicalId: "ci_eVx",
  slug: "lorcana-ci_eVx",
  printings: [
    {
      id: "set13-066",
      artId: "set13-066",
      setCode: "set13",
      collectorNumber: "66",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-066"],
  cardType: "action",
  name: "Petrify",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 66,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_19589a8a5ccd45b681e4d75367dd9c9a",
  },
  text: "Exert chosen opposing character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: petrifyI18n,
};
