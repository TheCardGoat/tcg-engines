import type { ActionCard } from "@tcg/lorcana-types";
import { quickPatchI18n } from "./027-quick-patch.i18n";

export const quickPatch: ActionCard = {
  id: "Wq8",
  canonicalId: "ci_Wq8",
  reprints: ["set3-027"],
  cardType: "action",
  name: "Quick Patch",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 27,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5364fdf0cf144ac38d2d7c824f8cc72f",
    tcgPlayer: 538310,
  },
  text: "Remove up to 3 damage from chosen location.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: { type: "up-to", value: 3 },
        target: {
          cardTypes: ["location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
  ],
  i18n: quickPatchI18n,
};
