import type { ActionCard } from "@tcg/lorcana-types";
import { reviveI18n } from "./027-revive.i18n";

export const revive: ActionCard = {
  id: "079",
  canonicalId: "ci_s1g",
  slug: "lorcana-ci_s1g",
  printings: [
    {
      id: "set5-027",
      artId: "set5-027",
      setCode: "set5",
      collectorNumber: "27",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set5-027"],
  cardType: "action",
  name: "Revive",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 27,
  rarity: "rare",
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
  i18n: reviveI18n,
};
