import type { ActionCard } from "@tcg/lorcana-types";
import { fourDozenEggsP1PromoI18n } from "./p1-033-four-dozen-eggs-promo.i18n";

export const fourDozenEggsP1Promo: ActionCard = {
  id: "Uv6",
  canonicalId: "ci_jY8",
  slug: "lorcana-ci_jY8",
  printings: [
    {
      id: "set2-p1-033-promo",
      artId: "ci_jY8-promo",
      setCode: "set2",
      collectorNumber: "33",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set2-163", "set9-164"],
  cardType: "action",
  name: "Four Dozen Eggs",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 33,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_afa9023a2aeb4569bad0116e638821fa",
    tcgPlayer: "650098",
  },
  text: "Your characters gain Resist +2 until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        duration: "until-start-of-next-turn",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  i18n: fourDozenEggsP1PromoI18n,
};
