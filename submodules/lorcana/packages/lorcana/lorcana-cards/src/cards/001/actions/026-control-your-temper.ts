import type { ActionCard } from "@tcg/lorcana-types";
import { controlYourTemperI18n } from "./026-control-your-temper.i18n";

export const controlYourTemper: ActionCard = {
  id: "PZv",
  canonicalId: "ci_PZv",
  reprints: ["set1-026"],
  cardType: "action",
  name: "Control Your Temper!",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 26,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a593c8dd2fe4552a4874f7346527387",
    tcgPlayer: 493501,
  },
  text: "Chosen character gets -2 {S} this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
    },
  ],
  i18n: controlYourTemperI18n,
};
