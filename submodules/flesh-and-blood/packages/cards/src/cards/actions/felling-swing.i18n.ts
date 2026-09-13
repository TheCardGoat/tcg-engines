import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fellingSwing } from "./felling-swing.ts";

export const fellingSwingI18n = defineFamilyI18n(fellingSwing, {
  en: {
    name: "Felling Swing",
    text: (amount) => `Your next axe attack this turn gains +${amount}{p}.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: fellingSwingRedI18n,
  yellow: fellingSwingYellowI18n,
  blue: fellingSwingBlueI18n,
} = fellingSwingI18n.cards;
