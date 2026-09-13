import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bitingBlade } from "./biting-blade.ts";

export const bitingBladeI18n = defineFamilyI18n(bitingBlade, {
  en: {
    name: "Biting Blade",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target weapon attack gains +${amount}{p}.\nReprise - If the defending hero has defended with a card from their hand this chain link, weapons you control gain +1{p} until end of turn.`,
  },
});
export const {
  red: bitingBladeRedI18n,
  yellow: bitingBladeYellowI18n,
  blue: bitingBladeBlueI18n,
} = bitingBladeI18n.cards;
