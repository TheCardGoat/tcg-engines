import type { ActionCard } from "@tcg/lorcana-types";
import { chompI18n } from "./096-chomp.i18n";

export const chomp: ActionCard = {
  id: "vgW",
  canonicalId: "ci_vgW",
  reprints: ["set10-096"],
  cardType: "action",
  name: "Chomp!",
  inkType: ["emerald"],
  set: "010",
  cardNumber: 96,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1b74cd74b69f4a369ce0a8af4cb21e10",
    tcgPlayer: 659187,
  },
  text: "Deal 2 damage to chosen damaged character.",
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CHOSEN_DAMAGED_CHARACTER",
        type: "deal-damage",
      },
      type: "action",
    },
  ],
  i18n: chompI18n,
};
