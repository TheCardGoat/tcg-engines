import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { waxOn } from "./wax-on.ts";

export const waxOnI18n = defineFamilyI18n(waxOn, {
  en: {
    name: "Wax On",
    text: "While Wax On is defending an attack action card with cost 0, it gains +2{d}.",
    typeText: "Ninja Defense Reaction",
  },
});

export const { red: waxOnRedI18n, yellow: waxOnYellowI18n, blue: waxOnBlueI18n } = waxOnI18n.cards;
