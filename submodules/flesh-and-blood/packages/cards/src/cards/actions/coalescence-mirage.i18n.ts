import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { coalescenceMirage } from "./coalescence-mirage.ts";

export const coalescenceMirageI18n = defineFamilyI18n(coalescenceMirage, {
  en: {
    name: "Coalescence Mirage",
    typeText: "Illusionist Action - Attack",
    text: "Phantasm\nWhen Coalescence Mirage is destroyed, you may put an Illusionist aura card with cost 0 from your hand into the arena.",
  },
});

export const {
  red: coalescenceMirageRedI18n,
  yellow: coalescenceMirageYellowI18n,
  blue: coalescenceMirageBlueI18n,
} = coalescenceMirageI18n.cards;
