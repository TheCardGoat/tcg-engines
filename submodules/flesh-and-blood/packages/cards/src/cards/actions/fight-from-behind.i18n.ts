import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fightFromBehind } from "./fight-from-behind.ts";

export const fightFromBehindI18n = defineFamilyI18n(fightFromBehind, {
  en: {
    name: "Fight from Behind",
    text: "When this attacks or defends, if you have less {h} than each other hero, the crowd cheers you.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: fightFromBehindRedI18n,
  yellow: fightFromBehindYellowI18n,
  blue: fightFromBehindBlueI18n,
} = fightFromBehindI18n.cards;
