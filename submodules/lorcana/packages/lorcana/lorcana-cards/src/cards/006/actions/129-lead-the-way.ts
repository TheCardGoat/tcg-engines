import type { ActionCard } from "@tcg/lorcana-types";
import { leadTheWayI18n } from "./129-lead-the-way.i18n";

export const leadTheWay: ActionCard = {
  id: "4h8",
  canonicalId: "ci_4h8",
  reprints: ["set6-129"],
  cardType: "action",
  name: "Lead the Way",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 129,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_025d33fc4b0c45caabfa10a108e46acd",
    tcgPlayer: 593020,
  },
  text: "Your characters get +2 {S} this turn.",
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "3ig-1",
      text: "Your characters get +2 {S} this turn.",
      type: "action",
    },
  ],
  i18n: leadTheWayI18n,
};
