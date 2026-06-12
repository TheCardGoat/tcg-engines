import type { ActionCard } from "@tcg/lorcana-types";
import { healingGlowI18n } from "./028-healing-glow.i18n";

export const healingGlow: ActionCard = {
  id: "S50",
  canonicalId: "ci_S50",
  reprints: ["set1-028"],
  cardType: "action",
  name: "Healing Glow",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 28,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce4f357a6aa24302ba5553eefea4930a",
    tcgPlayer: 492713,
  },
  text: "Remove up to 2 damage from chosen character.",
  abilities: [
    {
      effect: {
        amount: { type: "up-to", value: 2 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "1ix-1",
      text: "Remove up to 2 damage from chosen character.",
      type: "action",
    },
  ],
  i18n: healingGlowI18n,
};
