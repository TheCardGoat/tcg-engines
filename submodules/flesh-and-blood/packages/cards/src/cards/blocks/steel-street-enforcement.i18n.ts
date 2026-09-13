import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { steelStreetEnforcement } from "./steel-street-enforcement.ts";

export const steelStreetEnforcementI18n = defineFamilyI18n(steelStreetEnforcement, {
  en: {
    name: "Steel Street Enforcement",
    text: "Evo Upgrade - While this is defending, it gets +X{d}, where X is the number of Evos you have equipped.",
    typeText: "Mechanologist Block",
  },
});

export const { blue: steelStreetEnforcementBlueI18n } = steelStreetEnforcementI18n.cards;
