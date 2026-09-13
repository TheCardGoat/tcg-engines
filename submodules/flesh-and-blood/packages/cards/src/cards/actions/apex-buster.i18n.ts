import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { apexBuster } from "./apex-buster.ts";

export const apexBusterI18n = defineFamilyI18n(apexBuster, {
  en: {
    name: "Apex Buster",
    typeText: "Brute Action - Attack",
    text: "Instant - {r}{r}, discard this: Destroy target card that is defending an attack you control with 6 or more base {p}.",
  },
});

export const { yellow: apexBusterYellowI18n } = apexBusterI18n.cards;
