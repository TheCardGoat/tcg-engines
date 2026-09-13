import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { nimby } from "./nimby.ts";

export const nimbyI18n = defineFamilyI18n(nimby, {
  en: {
    name: "Nimby",
    text: "When this attacks, you may search your deck for a Nimblism, reveal it, put it into your hand, then shuffle.",
    typeText: "Generic Action - Attack",
  },
});

export const { red: nimbyRedI18n, yellow: nimbyYellowI18n, blue: nimbyBlueI18n } = nimbyI18n.cards;
