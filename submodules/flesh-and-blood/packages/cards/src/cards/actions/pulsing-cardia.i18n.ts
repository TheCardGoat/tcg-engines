import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pulsingCardia } from "./pulsing-cardia.ts";

export const pulsingCardiaI18n = defineFamilyI18n(pulsingCardia, {
  en: {
    name: "Pulsing Cardia",
    typeText: "Lightning Illusionist Action - Attack",
    text: "Whenever this fragments, gain {r}.\nFragment",
  },
});

export const {
  red: pulsingCardiaRedI18n,
  yellow: pulsingCardiaYellowI18n,
  blue: pulsingCardiaBlueI18n,
} = pulsingCardiaI18n.cards;
