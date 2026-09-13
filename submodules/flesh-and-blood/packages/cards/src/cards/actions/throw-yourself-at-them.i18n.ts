import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { throwYourselfAtThem } from "./throw-yourself-at-them.ts";

export const throwYourselfAtThemI18n = defineFamilyI18n(throwYourselfAtThem, {
  en: {
    name: "Throw Yourself at Them",
    text: "When this attacks a hero, you may have target dagger you control deal 1 damage to them. If damage is dealt this way, the dagger has hit. Destroy the dagger.\nGo again",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: throwYourselfAtThemRedI18n,
  yellow: throwYourselfAtThemYellowI18n,
  blue: throwYourselfAtThemBlueI18n,
} = throwYourselfAtThemI18n.cards;
