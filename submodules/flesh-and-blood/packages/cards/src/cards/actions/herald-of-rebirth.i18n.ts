import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heraldOfRebirth } from "./herald-of-rebirth.ts";

export const heraldOfRebirthI18n = defineFamilyI18n(heraldOfRebirth, {
  en: {
    name: "Herald of Rebirth",
    typeText: "Light Illusionist Action - Attack",
    text: "When this hits, put it into your hero's soul and put up to 1 card with phantasm from your graveyard on top of your deck.\nPhantasm",
  },
});

export const {
  red: heraldOfRebirthRedI18n,
  yellow: heraldOfRebirthYellowI18n,
  blue: heraldOfRebirthBlueI18n,
} = heraldOfRebirthI18n.cards;
