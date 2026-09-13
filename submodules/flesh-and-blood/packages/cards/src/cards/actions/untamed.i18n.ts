import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { untamed } from "./untamed.ts";

export const untamedI18n = defineFamilyI18n(untamed, {
  en: {
    name: "Untamed",
    text: "When this attacks, the next Crouching Tiger you play this combat chain gets +1{p}.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: untamedRedI18n,
  yellow: untamedYellowI18n,
  blue: untamedBlueI18n,
} = untamedI18n.cards;
