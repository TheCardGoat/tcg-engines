import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overTheTop } from "./over-the-top.ts";

export const overTheTopI18n = defineFamilyI18n(overTheTop, {
  en: {
    name: "Over the Top",
    text: "If this has {p} greater than its base, it gets overpower.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: overTheTopRedI18n,
  yellow: overTheTopYellowI18n,
  blue: overTheTopBlueI18n,
} = overTheTopI18n.cards;
