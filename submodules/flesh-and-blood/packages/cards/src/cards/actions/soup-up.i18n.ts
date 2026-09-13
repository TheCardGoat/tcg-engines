import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soupUp } from "./soup-up.ts";

export const soupUpI18n = defineFamilyI18n(soupUp, {
  en: {
    name: "Soup Up",
    text: "If an item you control has been destroyed this turn, this gets go again.\nGalvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: soupUpRedI18n,
  yellow: soupUpYellowI18n,
  blue: soupUpBlueI18n,
} = soupUpI18n.cards;
