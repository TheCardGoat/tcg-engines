import type { ActionCard } from "@tcg/lorcana-types";
import { howFarIllGoP1PromoI18n } from "./p1-028-how-far-ill-go-promo.i18n";

export const howFarIllGoP1Promo: ActionCard = {
  id: "Jfx",
  canonicalId: "ci_ySL",
  slug: "lorcana-ci_ySL",
  printings: [
    {
      id: "set3-p1-028-promo",
      artId: "ci_ySL-promo",
      setCode: "set3",
      collectorNumber: "28",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set3-161"],
  cardType: "action",
  name: "How Far I'll Go",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 28,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_b6996baaca9440328210eecc4afdc123",
    tcgPlayer: "539102",
  },
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 1,
            max: 1,
          },
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            exerted: true,
            facedown: true,
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: howFarIllGoP1PromoI18n,
};
