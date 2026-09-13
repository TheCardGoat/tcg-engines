import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { instillFear } from "./instill-fear.ts";

export const instillFearI18n = defineFamilyI18n(instillFear, {
  en: {
    name: "Instill Fear",
    text: "When this attacks a hero, intimidate them.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: instillFearRedI18n,
  yellow: instillFearYellowI18n,
  blue: instillFearBlueI18n,
} = instillFearI18n.cards;
