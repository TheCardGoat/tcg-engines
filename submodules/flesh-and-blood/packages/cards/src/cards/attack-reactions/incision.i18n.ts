import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { incision } from "./incision.ts";

export const incisionI18n = defineFamilyI18n(incision, {
  en: {
    name: "Incision",
    typeText: "Assassin / Warrior Attack Reaction",
    text: (amount) => `Target dagger attack gets +${amount}{p}.`,
  },
});
export const {
  red: incisionRedI18n,
  yellow: incisionYellowI18n,
  blue: incisionBlueI18n,
} = incisionI18n.cards;
