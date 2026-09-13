import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bluffCatcher } from "./bluff-catcher.ts";

export const bluffCatcherI18n = defineFamilyI18n(bluffCatcher, {
  en: {
    name: "Bluff Catcher",
    typeText: "Warrior Action",
    text: 'You may destroy a Gold you control rather than pay this card\'s {r} cost.\nYour next sword attack this turn gets +3{p} and "When this attacks, wager with the defending hero. The winner gets +1{i} during their next end phase."\nGo again',
  },
});

export const { yellow: bluffCatcherYellowI18n } = bluffCatcherI18n.cards;
