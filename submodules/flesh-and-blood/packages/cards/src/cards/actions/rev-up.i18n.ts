import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { revUp } from "./rev-up.ts";

export const revUpI18n = defineFamilyI18n(revUp, {
  en: {
    name: "Rev Up",
    text: "If you control a Hyper Driver, this costs {r} less to play.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const { red: revUpRedI18n, yellow: revUpYellowI18n, blue: revUpBlueI18n } = revUpI18n.cards;
