import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { splinteringDeadwood } from "./splintering-deadwood.ts";

export const splinteringDeadwoodI18n = defineFamilyI18n(splinteringDeadwood, {
  en: {
    name: "Splintering Deadwood",
    text: "When this attacks or hits, you may destroy an aura you control. If you do, create a Runechant token.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: splinteringDeadwoodRedI18n,
  yellow: splinteringDeadwoodYellowI18n,
  blue: splinteringDeadwoodBlueI18n,
} = splinteringDeadwoodI18n.cards;
