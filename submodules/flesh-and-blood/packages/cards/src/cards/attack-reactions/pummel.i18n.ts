import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pummel } from "./pummel.ts";

export const pummelI18n = defineFamilyI18n(pummel, {
  en: {
    name: "Pummel",
    typeText: "Generic Attack Reaction",
    text: (amount) =>
      `Choose 1;\n- Target club or hammer weapon attack gains +${amount}{p}.\n- Target attack action card with cost 2 or more gets +${amount}{p} and "When this hits a hero, they discard a card."`,
  },
});

export const {
  red: pummelRedI18n,
  yellow: pummelYellowI18n,
  blue: pummelBlueI18n,
} = pummelI18n.cards;
