import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crowdControl } from "./crowd-control.ts";

export const crowdControlI18n = defineFamilyI18n(crowdControl, {
  en: {
    name: "Crowd Control",
    text: "When this defends, you may pay {r}{r}{r}. If you do, it gets +1{d} for each opposing hero.",
    typeText: "Bard Block",
  },
});

export const {
  red: crowdControlRedI18n,
  yellow: crowdControlYellowI18n,
  blue: crowdControlBlueI18n,
} = crowdControlI18n.cards;
