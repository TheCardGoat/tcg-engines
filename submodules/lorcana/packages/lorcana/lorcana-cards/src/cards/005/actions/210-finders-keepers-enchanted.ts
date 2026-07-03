import type { ActionCard } from "@tcg/lorcana-types";
import { findersKeepersEnchantedI18n } from "./210-finders-keepers-enchanted.i18n";

export const findersKeepersEnchanted: ActionCard = {
  id: "FvQ",
  canonicalId: "ci_6e1",
  slug: "lorcana-ci_6e1",
  printings: [
    {
      id: "set5-210-enchanted",
      artId: "ci_6e1-enchanted",
      setCode: "set5",
      collectorNumber: "210",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-060"],
  cardType: "action",
  name: "Finders Keepers",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2ea432892434d9c9814d4bf6c3791a5",
    tcgPlayer: "561997",
  },
  text: "Draw 3 cards.",
  abilities: [
    {
      id: "q4f-1",
      effect: {
        amount: 3,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "action",
      text: "Draw 3 cards.",
    },
  ],
  i18n: findersKeepersEnchantedI18n,
};
