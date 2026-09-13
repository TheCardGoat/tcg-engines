import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wartuneHerald } from "./wartune-herald.ts";

export const wartuneHeraldI18n = defineFamilyI18n(wartuneHerald, {
  en: {
    name: "Wartune Herald",
    typeText: "Light Illusionist Action - Attack",
    text: "When this hits, put it into your soul.\nPhantasm",
  },
});

export const {
  red: wartuneHeraldRedI18n,
  yellow: wartuneHeraldYellowI18n,
  blue: wartuneHeraldBlueI18n,
} = wartuneHeraldI18n.cards;
