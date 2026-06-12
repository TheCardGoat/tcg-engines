import type { ActionCard } from "@tcg/lorcana-types";
import { letTheStormRageOnI18n } from "./199-let-the-storm-rage-on.i18n";

export const letTheStormRageOn: ActionCard = {
  id: "404",
  canonicalId: "ci_404",
  reprints: ["set2-199"],
  cardType: "action",
  name: "Let the Storm Rage On",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "002",
  cardNumber: 199,
  rarity: "common",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ce1ec049b9994d6fae071a0f74886cb3",
    tcgPlayer: 527239,
  },
  text: "Deal 2 damage to chosen character. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 2,
            target: "CHOSEN_CHARACTER",
            type: "deal-damage",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: letTheStormRageOnI18n,
};
