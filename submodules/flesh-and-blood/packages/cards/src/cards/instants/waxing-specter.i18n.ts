import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { waxingSpecter } from "./waxing-specter.ts";

export const waxingSpecterI18n = defineFamilyI18n(waxingSpecter, {
  en: {
    name: "Waxing Specter",
    typeText: "Mystic Illusionist Instant - Aura",
    text: (ward) =>
      `If you've pitched a blue card this turn, this enters the arena with a +1{p} counter.\nWard ${ward}`,
  },
});

export const {
  red: waxingSpecterRedI18n,
  yellow: waxingSpecterYellowI18n,
  blue: waxingSpecterBlueI18n,
} = waxingSpecterI18n.cards;
