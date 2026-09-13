import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sneakAttack } from "./sneak-attack.ts";

export const sneakAttackI18n = defineFamilyI18n(sneakAttack, {
  en: {
    name: "Sneak Attack",
    text: "If you've played or activated an attack reaction this chain link, Sneak Attack has +4{p}.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: sneakAttackRedI18n,
  yellow: sneakAttackYellowI18n,
  blue: sneakAttackBlueI18n,
} = sneakAttackI18n.cards;
