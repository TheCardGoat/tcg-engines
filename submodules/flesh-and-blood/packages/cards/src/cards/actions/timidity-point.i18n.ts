import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { timidityPoint } from "./timidity-point.ts";

export const timidityPointI18n = defineFamilyI18n(timidityPoint, {
  en: {
    name: "Timidity Point",
    text: "When Timidity Point hits a hero, attacks they control lose and can't gain dominate during their next turn.",
    typeText: "Ranger Action - Arrow Attack",
  },
});

export const {
  red: timidityPointRedI18n,
  yellow: timidityPointYellowI18n,
  blue: timidityPointBlueI18n,
} = timidityPointI18n.cards;
