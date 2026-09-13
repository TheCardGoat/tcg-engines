import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { toThePoint } from "./to-the-point.ts";

export const toThePointI18n = defineFamilyI18n(toThePoint, {
  en: {
    name: "To the Point",
    typeText: "Assassin / Warrior Attack Reaction",
    text: (amount) =>
      `Target dagger attack gets +${amount}{p}. If the defending hero is marked, instead it gets +${amount + 1}{p}.`,
  },
});
export const {
  red: toThePointRedI18n,
  yellow: toThePointYellowI18n,
  blue: toThePointBlueI18n,
} = toThePointI18n.cards;
