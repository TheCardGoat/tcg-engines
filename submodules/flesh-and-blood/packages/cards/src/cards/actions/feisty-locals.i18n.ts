import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { feistyLocals } from "./feisty-locals.ts";

export const feistyLocalsI18n = defineFamilyI18n(feistyLocals, {
  en: {
    name: "Feisty Locals",
    typeText: "Generic Action - Attack",
    text: "If this is defended by an action card, this gets +2{p}.",
  },
});

export const {
  red: feistyLocalsRedI18n,
  yellow: feistyLocalsYellowI18n,
  blue: feistyLocalsBlueI18n,
} = feistyLocalsI18n.cards;
