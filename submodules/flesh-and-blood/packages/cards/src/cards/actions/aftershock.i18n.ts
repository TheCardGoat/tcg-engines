import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aftershock } from "./aftershock.ts";

export const aftershockI18n = defineFamilyI18n(aftershock, {
  en: {
    name: "Aftershock",
    text: "When this attacks, if you've controlled a Seismic Surge token this turn, create a Seismic Surge token.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: aftershockRedI18n,
  yellow: aftershockYellowI18n,
  blue: aftershockBlueI18n,
} = aftershockI18n.cards;
