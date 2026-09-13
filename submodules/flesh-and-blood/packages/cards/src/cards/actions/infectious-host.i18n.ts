import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { infectiousHost } from "./infectious-host.ts";

export const infectiousHostI18n = defineFamilyI18n(infectiousHost, {
  en: {
    name: "Infectious Host",
    text: "When this attacks a hero, if you control a Frailty token, create a Frailty token under their control, then repeat for Inertia and Bloodrot Pox.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: infectiousHostRedI18n,
  yellow: infectiousHostYellowI18n,
  blue: infectiousHostBlueI18n,
} = infectiousHostI18n.cards;
