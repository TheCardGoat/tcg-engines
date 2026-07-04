import type { ActionCard } from "@tcg/lorcana-types";
import { dragonFireI18n } from "./130-dragon-fire.i18n";

export const dragonFire: ActionCard = {
  id: "RUF",
  canonicalId: "ci_fJr",
  slug: "lorcana-ci_fJr",
  printings: [
    {
      id: "set1-130",
      artId: "set1-130",
      setCode: "set1",
      collectorNumber: "130",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-130", "set10-133"],
  cardType: "action",
  name: "Dragon Fire",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_f54b0e3b38d340ffa793953c49e6cb56",
  },
  text: "Banish chosen character.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
  i18n: dragonFireI18n,
};
