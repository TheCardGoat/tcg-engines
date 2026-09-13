import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { burgeoning } from "./burgeoning.ts";

export const burgeoningI18n = defineFamilyI18n(burgeoning, {
  en: {
    name: "Burgeoning",
    text: "If this was played from arsenal, it gains +1{p}.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: burgeoningRedI18n,
  yellow: burgeoningYellowI18n,
  blue: burgeoningBlueI18n,
} = burgeoningI18n.cards;
