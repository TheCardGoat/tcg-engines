import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pitfallTrap } from "./pitfall-trap.ts";

export const pitfallTrapI18n = defineFamilyI18n(pitfallTrap, {
  en: {
    name: "Pitfall Trap",
    text: "Pitfall Trap can only be played from arsenal.\nWhen this defends, deal 2 damage to the attacking hero unless they pay {r}.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { yellow: pitfallTrapYellowI18n } = pitfallTrapI18n.cards;
