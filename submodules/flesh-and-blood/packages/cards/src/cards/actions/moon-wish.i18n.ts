import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { moonWish } from "./moon-wish.ts";

export const moonWishI18n = defineFamilyI18n(moonWish, {
  en: {
    name: "Moon Wish",
    text: "You may put a card from your hand on top of your deck rather than pay Moon Wish's {r} cost.\nIf Moon Wish hits, search your deck for a card named Sun Kiss, reveal it, put it into your hand, then shuffle your deck.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: moonWishRedI18n,
  yellow: moonWishYellowI18n,
  blue: moonWishBlueI18n,
} = moonWishI18n.cards;
