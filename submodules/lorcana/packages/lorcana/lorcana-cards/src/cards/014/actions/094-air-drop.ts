import type { ActionCard } from "@tcg/lorcana-types";
import { airDropI18n } from "./094-air-drop.i18n";

export const airDrop: ActionCard = {
  id: "s22",
  canonicalId: "ci_s22",
  slug: "lorcana-ci_s22",
  printings: [
    {
      id: "set14-094",
      artId: "set14-094",
      setCode: "set14",
      collectorNumber: "94",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-094"],
  cardType: "action",
  name: "Air Drop",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 94,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_03f2c8b1d6614b70a9bbe2d1092351aa",
  },
  text: "Deal 3 damage to chosen character. If that character has damage, deal 5 damage instead.",
  abilities: [
    {
      type: "action",
      text: "Deal 3 damage to chosen character. If that character has damage, deal 5 damage instead.",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
        selfReplacement: {
          condition: {
            type: "selected-target-has-damage",
          },
          value: 5,
        },
      },
    },
  ],
  i18n: airDropI18n,
};
