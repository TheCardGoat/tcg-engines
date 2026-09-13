import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cognitionField } from "./cognition-field.ts";

export const cognitionFieldI18n = defineFamilyI18n(cognitionField, {
  en: {
    name: "Cognition Field",
    text: "Galvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Block",
  },
});

export const {
  red: cognitionFieldRedI18n,
  yellow: cognitionFieldYellowI18n,
  blue: cognitionFieldBlueI18n,
} = cognitionFieldI18n.cards;
