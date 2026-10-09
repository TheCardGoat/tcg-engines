import type { ActionCard } from "@tcg/lorcana-types";
import { aboveTheCrowdI18n } from "./095-above-the-crowd.i18n";

export const aboveTheCrowd: ActionCard = {
  id: "ojw",
  canonicalId: "ci_ojw",
  slug: "lorcana-ci_ojw",
  printings: [
    {
      id: "set14-095",
      artId: "set14-095",
      setCode: "set14",
      collectorNumber: "95",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-095"],
  cardType: "action",
  name: "Above the Crowd",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 95,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_ad5100c1182246a1a864abd42423f715",
  },
  text: "Put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
      },
    },
  ],
  i18n: aboveTheCrowdI18n,
};
