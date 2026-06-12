import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnGoldLoverI18n } from "./147-prince-john-gold-lover.i18n";

export const princeJohnGoldLover: CharacterCard = {
  id: "1ju",
  canonicalId: "ci_1ju",
  reprints: ["set5-147"],
  cardType: "character",
  name: "Prince John",
  version: "Gold Lover",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 147,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6134218a3104ed7b31df482ccb0b0a9",
    tcgPlayer: 556435,
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
  i18n: princeJohnGoldLoverI18n,
};
