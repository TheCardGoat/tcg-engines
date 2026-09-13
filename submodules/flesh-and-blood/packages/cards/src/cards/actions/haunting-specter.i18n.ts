import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hauntingSpecter } from "./haunting-specter.ts";

export const hauntingSpecterI18n = defineFamilyI18n(hauntingSpecter, {
  en: {
    name: "Haunting Specter",
    typeText: "Illusionist Action - Aura",
    text: "When this leaves the arena, create a Spectral Shield token, then if you control no other Illusionist auras, put a +1{p} counter on it.\nWard 4",
  },
});

export const {
  red: hauntingSpecterRedI18n,
  yellow: hauntingSpecterYellowI18n,
  blue: hauntingSpecterBlueI18n,
} = hauntingSpecterI18n.cards;
