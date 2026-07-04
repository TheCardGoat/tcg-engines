import type { ActionCard } from "@tcg/lorcana-types";
import { reviveEnchantedI18n } from "./207-revive-enchanted.i18n";

export const reviveEnchanted: ActionCard = {
  id: "rBt",
  canonicalId: "ci_s1g",
  slug: "lorcana-ci_s1g",
  printings: [
    {
      id: "set5-207-enchanted",
      artId: "ci_s1g-enchanted",
      setCode: "set5",
      collectorNumber: "207",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-027"],
  cardType: "action",
  name: "Revive",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_d7a644695e604c958aee5d0ba8fa8415",
    tcgPlayer: "561979",
  },
  text: "Play a character card with cost 5 or less from your discard for free.",
  abilities: [
    {
      effect: {
        cardType: "character",
        cost: "free",
        filter: {
          cardType: "character",
          maxCost: 5,
        },
        from: "discard",
        type: "play-card",
      },
      id: "16b-1",
      text: "Play a character card with cost 5 or less from your discard for free.",
      type: "action",
    },
  ],
  i18n: reviveEnchantedI18n,
};
