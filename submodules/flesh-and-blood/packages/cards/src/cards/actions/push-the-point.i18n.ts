import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pushThePoint } from "./push-the-point.ts";

export const pushThePointI18n = defineFamilyI18n(pushThePoint, {
  en: {
    name: "Push the Point",
    text: "If the last attack on this combat chain hit, Push the Point gains +2{p}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: pushThePointRedI18n,
  yellow: pushThePointYellowI18n,
  blue: pushThePointBlueI18n,
} = pushThePointI18n.cards;
