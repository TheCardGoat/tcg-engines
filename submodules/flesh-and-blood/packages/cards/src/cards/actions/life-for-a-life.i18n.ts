import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lifeForALife } from "./life-for-a-life.ts";

export const lifeForALifeI18n = defineFamilyI18n(lifeForALife, {
  en: {
    name: "Life for a Life",
    text: "When this is played, if you have less {h} than an opposing hero, it gets go again.\nWhen this hits, gain 1{h}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: lifeForALifeRedI18n,
  yellow: lifeForALifeYellowI18n,
  blue: lifeForALifeBlueI18n,
} = lifeForALifeI18n.cards;
