import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnGoldLoverP2PromoI18n } from "./p2-001-prince-john-gold-lover-promo.i18n";

export const princeJohnGoldLoverP2Promo: CharacterCard = {
  id: "EQI",
  canonicalId: "ci_ktV",
  slug: "lorcana-ci_ktV",
  printings: [
    {
      id: "set5-p2-001-promo",
      artId: "ci_ktV-promo",
      setCode: "set5",
      collectorNumber: "1",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set5-147"],
  cardType: "character",
  name: "Prince John",
  version: "Gold Lover",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 1,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6134218a3104ed7b31df482ccb0b0a9",
    tcgPlayer: "556435",
  },
  text: [
    {
      title: "BEAUTIFUL, LOVELY TAXES",
      description:
        "{E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        cardType: "item",
        cost: "free",
        costRestriction: {
          comparison: "less-or-equal",
          value: 5,
        },
        entersExerted: true,
        from: ["hand", "discard"],
        type: "play-card",
      },
      id: "1b5-1",
      name: "BEAUTIFUL, LOVELY TAXES",
      text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
      type: "activated",
    },
  ],
  i18n: princeJohnGoldLoverP2PromoI18n,
};
