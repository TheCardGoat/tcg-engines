import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { frostFang } from "./frost-fang.ts";

export const frostFangI18n = defineFamilyI18n(frostFang, {
  en: {
    name: "Frost Fang",
    text: "If Frost Fang hits a hero, they discard a card unless they pay {r}{r}.",
    typeText: "Ice Action - Attack",
  },
});

export const {
  red: frostFangRedI18n,
  yellow: frostFangYellowI18n,
  blue: frostFangBlueI18n,
} = frostFangI18n.cards;
