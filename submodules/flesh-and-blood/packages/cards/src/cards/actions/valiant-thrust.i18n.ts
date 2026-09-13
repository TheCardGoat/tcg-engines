import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { valiantThrust } from "./valiant-thrust.ts";

export const valiantThrustI18n = defineFamilyI18n(valiantThrust, {
  en: {
    name: "Valiant Thrust",
    typeText: "Light Warrior Action - Attack",
    text: "If you've charged this turn, Valiant Thrust gains +3{p}.",
  },
});

export const {
  red: valiantThrustRedI18n,
  yellow: valiantThrustYellowI18n,
  blue: valiantThrustBlueI18n,
} = valiantThrustI18n.cards;
