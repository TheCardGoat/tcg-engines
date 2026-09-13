import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deadlySpinneret } from "./deadly-spinneret.ts";
const textByColor = {
  red: "Stealth\nInstant - Discard this: Equip a Graphene Chelicera token to each of your empty weapon zones.",
} as const;
export const deadlySpinneretI18n = defineFamilyI18n(deadlySpinneret, {
  en: {
    name: "Deadly Spinneret",
    typeText: "Assassin Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: deadlySpinneretRedI18n } = deadlySpinneretI18n.cards;
