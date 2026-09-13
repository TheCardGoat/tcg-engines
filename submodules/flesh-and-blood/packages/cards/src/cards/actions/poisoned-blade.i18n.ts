import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { poisonedBlade } from "./poisoned-blade.ts";

export const poisonedBladeI18n = defineFamilyI18n(poisonedBlade, {
  en: {
    name: "Poisoned Blade",
    text: "Whenever a dagger you own hits a hero this combat chain, they lose 1{h}.\nGo again",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: poisonedBladeRedI18n,
  yellow: poisonedBladeYellowI18n,
  blue: poisonedBladeBlueI18n,
} = poisonedBladeI18n.cards;
