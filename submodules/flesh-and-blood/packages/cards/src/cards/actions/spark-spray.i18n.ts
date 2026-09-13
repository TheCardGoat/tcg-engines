import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sparkSpray } from "./spark-spray.ts";

export const sparkSprayI18n = defineFamilyI18n(sparkSpray, {
  en: {
    name: "Spark Spray",
    typeText: "Lightning Action - Attack",
    text: "When this is defended by 1 or more cards, you may pay {r}. If you do, this gets +1{p}.",
  },
});

export const {
  red: sparkSprayRedI18n,
  yellow: sparkSprayYellowI18n,
  blue: sparkSprayBlueI18n,
} = sparkSprayI18n.cards;
