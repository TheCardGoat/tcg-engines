import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightningSurge } from "./lightning-surge.ts";

export const lightningSurgeI18n = defineFamilyI18n(lightningSurge, {
  en: {
    name: "Lightning Surge",
    typeText: "Lightning Action - Attack",
    text: "If this was played from arsenal, it gets go again.",
  },
});

export const {
  red: lightningSurgeRedI18n,
  yellow: lightningSurgeYellowI18n,
  blue: lightningSurgeBlueI18n,
} = lightningSurgeI18n.cards;
