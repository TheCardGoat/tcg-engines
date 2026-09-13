import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { silverTalons } from "./silver-talons.ts";

export const silverTalonsI18n = defineFamilyI18n(silverTalons, {
  en: {
    name: "Silver Talons",
    text: "When this attacks a hero, if it is Draconic, you may have target dagger you control deal 1 damage to them. If damage is dealt this way, the dagger has hit. Destroy the dagger.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: silverTalonsRedI18n,
  yellow: silverTalonsYellowI18n,
  blue: silverTalonsBlueI18n,
} = silverTalonsI18n.cards;
