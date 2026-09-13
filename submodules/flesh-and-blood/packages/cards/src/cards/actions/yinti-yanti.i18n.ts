import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { yintiYanti } from "./yinti-yanti.ts";

export const yintiYantiI18n = defineFamilyI18n(yintiYanti, {
  en: {
    name: "Yinti Yanti",
    text: "While Yinti Yanti is attacking and you control an aura, it has +1{p}.\nWhile Yinti Yanti is defending and you control an aura, it has +1{d}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: yintiYantiRedI18n,
  yellow: yintiYantiYellowI18n,
  blue: yintiYantiBlueI18n,
} = yintiYantiI18n.cards;
