import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { billowingMirage } from "./billowing-mirage.ts";

export const billowingMirageI18n = defineFamilyI18n(billowingMirage, {
  en: {
    name: "Billowing Mirage",
    typeText: "Draconic Illusionist Action - Attack",
    text: "When you attack with Billowing Mirage, transform up to 1 ash you control into an Aether Ashwing.\nGo again",
  },
});

export const {
  red: billowingMirageRedI18n,
  yellow: billowingMirageYellowI18n,
  blue: billowingMirageBlueI18n,
} = billowingMirageI18n.cards;
