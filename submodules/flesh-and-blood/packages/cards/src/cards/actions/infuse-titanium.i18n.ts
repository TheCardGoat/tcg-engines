import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { infuseTitanium } from "./infuse-titanium.ts";

export const infuseTitaniumI18n = defineFamilyI18n(infuseTitanium, {
  en: {
    name: "Infuse Titanium",
    text: "Galvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: infuseTitaniumRedI18n,
  yellow: infuseTitaniumYellowI18n,
  blue: infuseTitaniumBlueI18n,
} = infuseTitaniumI18n.cards;
