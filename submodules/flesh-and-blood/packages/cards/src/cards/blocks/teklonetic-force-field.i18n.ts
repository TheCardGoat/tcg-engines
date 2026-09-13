import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tekloneticForceField } from "./teklonetic-force-field.ts";

export const tekloneticForceFieldI18n = defineFamilyI18n(tekloneticForceField, {
  en: {
    name: "Teklonetic Force Field",
    text: "When this defends an attack with overpower, this gets +2{d}.",
    typeText: "Mechanologist Block",
  },
});

export const {
  red: tekloneticForceFieldRedI18n,
  yellow: tekloneticForceFieldYellowI18n,
  blue: tekloneticForceFieldBlueI18n,
} = tekloneticForceFieldI18n.cards;
