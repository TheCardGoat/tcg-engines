import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overswing } from "./overswing.ts";

export const overswingI18n = defineFamilyI18n(overswing, {
  en: {
    name: "Overswing",
    text: "The next Guardian attack action card you play this turn gets +3{p}.\nGo again\nHeave 2",
    typeText: "Guardian Action",
  },
});

export const {
  red: overswingRedI18n,
  yellow: overswingYellowI18n,
  blue: overswingBlueI18n,
} = overswingI18n.cards;
