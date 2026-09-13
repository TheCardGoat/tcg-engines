import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { murkmireGrapnel } from "./murkmire-grapnel.ts";

export const murkmireGrapnelI18n = defineFamilyI18n(murkmireGrapnel, {
  en: {
    name: "Murkmire Grapnel",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Murkmire Grapnel has an aim counter, it has +1{p}.\nDamage that would be dealt by Murkmire Grapnel can't be prevented.",
  },
});

export const {
  red: murkmireGrapnelRedI18n,
  yellow: murkmireGrapnelYellowI18n,
  blue: murkmireGrapnelBlueI18n,
} = murkmireGrapnelI18n.cards;
