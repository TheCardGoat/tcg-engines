import type { ActionCard } from "@tcg/lorcana-types";
import { ragingStormEnchantedI18n } from "./225-raging-storm-enchanted.i18n";

export const ragingStormEnchanted: ActionCard = {
  id: "aR5",
  canonicalId: "ci_QH5",
  slug: "lorcana-ci_QH5",
  printings: [
    {
      id: "set11-225-enchanted",
      artId: "ci_QH5-enchanted",
      setCode: "set11",
      collectorNumber: "225",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-028"],
  cardType: "action",
  name: "Raging Storm",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  inkable: false,
  externalIds: {
    lorcast: "crd_b3c4b83755bd417bb09f35ffea57cb68",
    tcgPlayer: "677159",
  },
  text: "Banish all characters.",
  abilities: [
    {
      type: "action",
      text: "Banish all characters.",
      effect: {
        type: "banish",
        target: "ALL_CHARACTERS",
      },
    },
  ],
  i18n: ragingStormEnchantedI18n,
};
