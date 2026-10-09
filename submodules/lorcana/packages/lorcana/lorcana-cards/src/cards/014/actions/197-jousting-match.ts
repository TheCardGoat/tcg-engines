import type { ActionCard } from "@tcg/lorcana-types";
import { joustingMatchI18n } from "./197-jousting-match.i18n";

export const joustingMatch: ActionCard = {
  id: "iRc",
  canonicalId: "ci_iRc",
  slug: "lorcana-ci_iRc",
  printings: [
    {
      id: "set14-197",
      artId: "set14-197",
      setCode: "set14",
      collectorNumber: "197",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-197"],
  cardType: "action",
  name: "Jousting Match",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 197,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_839bde73fef04b0f8d4934ed3516a92b",
  },
  text: "Deal 2 damage to chosen character. If you removed an ink drop to play this action, deal 5 damage instead.",
  abilities: [
    {
      type: "action",
      text: "Deal 2 damage to chosen character. If you removed an ink drop to play this action, deal 5 damage instead.",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
        selfReplacement: {
          condition: {
            type: "condition",
            condition: {
              type: "play-context",
              context: "paid-with-ink-drop",
            },
          },
          value: 5,
        },
      },
    },
  ],
  i18n: joustingMatchI18n,
};
