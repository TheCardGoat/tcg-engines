import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { outPace } from "./out-pace.ts";

export const outPaceI18n = defineFamilyI18n(outPace, {
  en: {
    name: "Out Pace",
    text: "Boost\nThis can't be defended by equipment.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: outPaceRedI18n,
  yellow: outPaceYellowI18n,
  blue: outPaceBlueI18n,
} = outPaceI18n.cards;
