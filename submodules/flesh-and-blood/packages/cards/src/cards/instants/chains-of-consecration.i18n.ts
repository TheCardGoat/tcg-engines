import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chainsOfConsecration } from "./chains-of-consecration.ts";
const textByColor = {
  yellow:
    "Prevent all damage target ally would deal this turn. If damage is prevented from a Shadow ally this way, banish it face-down.",
} as const;
export const chainsOfConsecrationI18n = defineFamilyI18n(chainsOfConsecration, {
  en: {
    name: "Chains of Consecration",
    typeText: "Light Instant",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { yellow: chainsOfConsecrationYellowI18n } = chainsOfConsecrationI18n.cards;
