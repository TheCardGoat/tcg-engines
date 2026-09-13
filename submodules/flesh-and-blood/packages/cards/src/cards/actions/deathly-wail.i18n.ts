import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deathlyWail } from "./deathly-wail.ts";

export const deathlyWailI18n = defineFamilyI18n(deathlyWail, {
  en: {
    name: "Deathly Wail",
    text: "Rune Gate\nWhen the combat chain closes, create Runechant tokens equal to the number of heroes who have lost {h} this turn.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: deathlyWailRedI18n,
  yellow: deathlyWailYellowI18n,
  blue: deathlyWailBlueI18n,
} = deathlyWailI18n.cards;
