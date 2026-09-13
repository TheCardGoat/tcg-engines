import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { surgingMilitia } from "./surging-militia.ts";

export const surgingMilitiaI18n = defineFamilyI18n(surgingMilitia, {
  en: {
    name: "Surging Militia",
    text: "Surging Militia has +1{p} for each non-equipment card defending it.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: surgingMilitiaRedI18n,
  yellow: surgingMilitiaYellowI18n,
  blue: surgingMilitiaBlueI18n,
} = surgingMilitiaI18n.cards;
