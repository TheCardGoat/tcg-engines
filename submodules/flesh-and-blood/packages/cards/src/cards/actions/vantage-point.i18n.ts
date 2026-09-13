import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vantagePoint } from "./vantage-point.ts";

export const vantagePointI18n = defineFamilyI18n(vantagePoint, {
  en: {
    name: "Vantage Point",
    text: "If you've played or created an aura this turn, this gets overpower.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: vantagePointRedI18n,
  yellow: vantagePointYellowI18n,
  blue: vantagePointBlueI18n,
} = vantagePointI18n.cards;
