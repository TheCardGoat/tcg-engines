import type { ActionCard } from "@tcg/lorcana-types";
import { puttingItAllTogetherP3PromoI18n } from "./p3-027-putting-it-all-together-promo.i18n";

export const puttingItAllTogetherP3Promo: ActionCard = {
  id: "Azk",
  canonicalId: "ci_fi3",
  slug: "lorcana-ci_fi3",
  printings: [
    {
      id: "set10-p3-027-promo",
      artId: "ci_fi3-promo",
      setCode: "set10",
      collectorNumber: "27",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set10-196"],
  cardType: "action",
  name: "Putting It All Together",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 27,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c1f05cc2e5c4dae84e51404de23df74",
    tcgPlayer: "653912",
  },
  text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "their-next-turn",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
            type: "restriction",
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
  i18n: puttingItAllTogetherP3PromoI18n,
};
