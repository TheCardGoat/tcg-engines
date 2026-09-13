import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fyendalSFightingSpirit } from "./fyendal-s-fighting-spirit.ts";

export const fyendalSFightingSpiritI18n = defineFamilyI18n(fyendalSFightingSpirit, {
  en: {
    name: "Fyendal's Fighting Spirit",
    typeText: "Generic Action - Attack",
    text: "When this attacks or defends, if you have less {h} than an opposing hero, gain 1{h}.",
  },
});

export const {
  red: fyendalSFightingSpiritRedI18n,
  yellow: fyendalSFightingSpiritYellowI18n,
  blue: fyendalSFightingSpiritBlueI18n,
} = fyendalSFightingSpiritI18n.cards;
