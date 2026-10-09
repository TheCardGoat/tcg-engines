import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrueFriendP2PromoI18n } from "./p2-036-mickey-mouse-true-friend-promo.i18n";

export const mickeyMouseTrueFriendP2Promo: CharacterCard = {
  id: "Eq1",
  canonicalId: "ci_mvj",
  slug: "lorcana-ci_mvj",
  printings: [
    {
      id: "set1-p2-036-promo",
      artId: "ci_mvj-promo",
      setCode: "set1",
      collectorNumber: "36",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-012", "set9-013"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "True Friend",
  inkType: ["amber"],
  set: "001",
  cardNumber: 36,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_da34abc7da464b338103666b1ca3d0f8",
    tcgPlayer: "649962",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: mickeyMouseTrueFriendP2PromoI18n,
};
