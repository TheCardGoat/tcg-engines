import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drowningDire } from "./drowning-dire.ts";

export const drowningDireI18n = defineFamilyI18n(drowningDire, {
  en: {
    name: "Drowning Dire",
    text: "If you have played or created an aura this turn, Drowning Dire gains dominate.\nWhen Drowning Dire hits, you may put a 'non-attack' action card from your graveyard on the bottom of your deck.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: drowningDireRedI18n,
  yellow: drowningDireYellowI18n,
  blue: drowningDireBlueI18n,
} = drowningDireI18n.cards;
