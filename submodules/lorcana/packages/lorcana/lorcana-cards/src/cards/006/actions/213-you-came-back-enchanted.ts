import type { ActionCard } from "@tcg/lorcana-types";
import { youCameBackEnchantedI18n } from "./213-you-came-back-enchanted.i18n";

export const youCameBackEnchanted: ActionCard = {
  id: "cC3",
  canonicalId: "ci_wY5",
  slug: "lorcana-ci_wY5",
  printings: [
    {
      id: "set6-213-enchanted",
      artId: "ci_wY5-enchanted",
      setCode: "set6",
      collectorNumber: "213",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-097"],
  cardType: "action",
  name: "You Came Back",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_b29e4a26e9324724aab37e97a7738476",
    tcgPlayer: "591998",
  },
  text: "Ready chosen character.",
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
        type: "ready",
      },
      id: "1dw-1",
      text: "Ready chosen character.",
      type: "action",
    },
  ],
  i18n: youCameBackEnchantedI18n,
};
