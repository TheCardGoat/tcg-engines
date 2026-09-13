import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { expressLightning } from "./express-lightning.ts";

export const expressLightningI18n = defineFamilyI18n(expressLightning, {
  en: {
    name: "Express Lightning",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play Express Lightning, you may charge your hero's soul.",
  },
});

export const {
  red: expressLightningRedI18n,
  yellow: expressLightningYellowI18n,
  blue: expressLightningBlueI18n,
} = expressLightningI18n.cards;
