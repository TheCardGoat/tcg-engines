import type { ActionCard } from "@tcg/lorcana-types";
import { piercingAttackI18n } from "./102-piercing-attack.i18n";

export const piercingAttack: ActionCard = {
  id: "jj2",
  canonicalId: "ci_jj2",
  slug: "lorcana-ci_jj2",
  printings: [
    {
      id: "set13-102",
      artId: "set13-102",
      setCode: "set13",
      collectorNumber: "102",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-102"],
  cardType: "action",
  name: "Piercing Attack",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 102,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c8bafccee86e44229bddbe6438d98d99",
  },
  text: "Deal 2 damage to chosen character. This damage can't be reduced by Resist.",
  abilities: [
    {
      type: "action",
      text: "Deal 2 damage to chosen character. This damage can't be reduced by <Resist>.",
      effect: {
        type: "deal-damage",
        amount: 2,
        ignoreResist: true,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: piercingAttackI18n,
};
