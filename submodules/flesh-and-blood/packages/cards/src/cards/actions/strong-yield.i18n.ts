import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strongYield } from "./strong-yield.ts";

export const strongYieldI18n = defineFamilyI18n(strongYield, {
  en: {
    name: "Strong Yield",
    text: "Go again\nAt the beginning of your action phase, destroy this, then your next attack this turn gets +3{p}.",
    typeText: "Earth Action - Aura",
  },
});
export const {
  red: strongYieldRedI18n,
  yellow: strongYieldYellowI18n,
  blue: strongYieldBlueI18n,
} = strongYieldI18n.cards;
