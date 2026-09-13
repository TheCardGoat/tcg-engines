import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { toxicity } from "./toxicity.ts";

export const toxicityI18n = defineFamilyI18n(toxicity, {
  en: {
    name: "Toxicity",
    text: ({ value1 }) =>
      `The next Assassin or Ranger attack action card you play this turn gains "When this hits a hero, they lose ${value1}{h}."
Go again`,
    typeText: "Assassin / Ranger Action",
  },
});

export const {
  red: toxicityRedI18n,
  yellow: toxicityYellowI18n,
  blue: toxicityBlueI18n,
} = toxicityI18n.cards;
