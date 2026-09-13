import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deathlyDelight } from "./deathly-delight.ts";

export const deathlyDelightI18n = defineFamilyI18n(deathlyDelight, {
  en: {
    name: "Deathly Delight",
    text: "Rune Gate\nWhen the combat chain closes, gain {h} equal to the number of heroes who have lost {h} this turn.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: deathlyDelightRedI18n,
  yellow: deathlyDelightYellowI18n,
  blue: deathlyDelightBlueI18n,
} = deathlyDelightI18n.cards;
