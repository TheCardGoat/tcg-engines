import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dissolvingShield } from "./dissolving-shield.ts";

export const dissolvingShieldI18n = defineFamilyI18n(dissolvingShield, {
  en: {
    name: "Dissolving Shield",
    text: ({ value1 }) =>
      `Crank\nThis enters the arena with ${value1 === 1 ? "a" : value1} steam counter${value1 === 1 ? "" : "s"}. At the start of your turn, destroy this unless you remove a steam counter from it.\nInstant - Remove a steam counter from this: Prevent the next 1 damage that would be dealt to you this turn. If this has no steam counters, destroy it.`,
    typeText: "Mechanologist Action - Item",
  },
});

export const {
  red: dissolvingShieldRedI18n,
  yellow: dissolvingShieldYellowI18n,
  blue: dissolvingShieldBlueI18n,
} = dissolvingShieldI18n.cards;
