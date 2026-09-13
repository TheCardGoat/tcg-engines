import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { infuseAlloy } from "./infuse-alloy.ts";

export const infuseAlloyI18n = defineFamilyI18n(infuseAlloy, {
  en: {
    name: "Infuse Alloy",
    text: "Galvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: infuseAlloyRedI18n,
  yellow: infuseAlloyYellowI18n,
  blue: infuseAlloyBlueI18n,
} = infuseAlloyI18n.cards;
