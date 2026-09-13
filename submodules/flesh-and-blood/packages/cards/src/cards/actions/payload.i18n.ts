import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { payload } from "./payload.ts";

export const payloadI18n = defineFamilyI18n(payload, {
  en: {
    name: "Payload",
    text: "If you have boosted this combat chain, Payload gains dominate.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: payloadRedI18n,
  yellow: payloadYellowI18n,
  blue: payloadBlueI18n,
} = payloadI18n.cards;
