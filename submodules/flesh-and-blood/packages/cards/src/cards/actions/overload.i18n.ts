import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overload } from "./overload.ts";

export const overloadI18n = defineFamilyI18n(overload, {
  en: {
    name: "Overload",
    text: "Dominate\nIf Overload hits, it gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: overloadRedI18n,
  yellow: overloadYellowI18n,
  blue: overloadBlueI18n,
} = overloadI18n.cards;
