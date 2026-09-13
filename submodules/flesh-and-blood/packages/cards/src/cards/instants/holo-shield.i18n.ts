import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { holoShield } from "./holo-shield.ts";

export const holoShieldI18n = defineFamilyI18n(holoShield, {
  en: {
    name: "Holo Shield",
    typeText: "Lightning Illusionist Instant - Aura",
    text: ({ holoWard }) =>
      `Ward X, where X is ${holoWard} if this has a holo counter. Otherwise, X is 1.`,
  },
});

export const {
  red: holoShieldRedI18n,
  yellow: holoShieldYellowI18n,
  blue: holoShieldBlueI18n,
} = holoShieldI18n.cards;
