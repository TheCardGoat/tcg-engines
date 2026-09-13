import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flitteringForcefield } from "./flittering-forcefield.ts";

export const flitteringForcefieldI18n = defineFamilyI18n(flitteringForcefield, {
  en: {
    name: "Flittering Forcefield",
    text: "While this is defending, if you've played an instant card this chain link, this gets +1{d}.",
    typeText: "Lightning Defense Reaction",
  },
});
export const {
  red: flitteringForcefieldRedI18n,
  yellow: flitteringForcefieldYellowI18n,
  blue: flitteringForcefieldBlueI18n,
} = flitteringForcefieldI18n.cards;
