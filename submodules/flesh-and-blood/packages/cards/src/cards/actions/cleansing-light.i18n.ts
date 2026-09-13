import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cleansingLight } from "./cleansing-light.ts";

export const cleansingLightI18n = defineFamilyI18n(cleansingLight, {
  en: {
    name: "Cleansing Light",
    text: (_, color) =>
      `If a card has been put into your hero's soul this turn, you may play this as though it were an instant.\nDestroy target ${color.toLowerCase()} aura.`,
    typeText: "Light Action",
  },
});

export const {
  red: cleansingLightRedI18n,
  yellow: cleansingLightYellowI18n,
  blue: cleansingLightBlueI18n,
} = cleansingLightI18n.cards;
