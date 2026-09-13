import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overbear } from "./overbear.ts";

export const overbearI18n = defineFamilyI18n(overbear, {
  en: {
    name: "Overbear",
    typeText: "Generic Action",
    text: "Your next weapon attack this turn gets dominate.\nGo again",
  },
});

export const { red: overbearRedI18n } = overbearI18n.cards;
