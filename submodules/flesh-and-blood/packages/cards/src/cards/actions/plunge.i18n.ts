import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plunge } from "./plunge.ts";

export const plungeI18n = defineFamilyI18n(plunge, {
  en: {
    name: "Plunge",
    text: "When this hits, your next dagger attack this turn gains +1{p}.\nGo again",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: plungeRedI18n,
  yellow: plungeYellowI18n,
  blue: plungeBlueI18n,
} = plungeI18n.cards;
