import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { evenBiggerThanThat } from "./even-bigger-than-that.ts";

export const evenBiggerThanThatI18n = defineFamilyI18n(evenBiggerThanThat, {
  en: {
    name: "Even Bigger Than That!",
    typeText: "Generic Instant",
    text: (optCount) =>
      `Play Even Bigger Than That! only if you've dealt {p} this turn.\nOpt ${optCount}, then reveal the top card of your deck. If it has {p} greater than the amount of damage you've dealt this turn, create a Quicken token and draw a card.`,
  },
});

export const {
  red: evenBiggerThanThatRedI18n,
  yellow: evenBiggerThanThatYellowI18n,
  blue: evenBiggerThanThatBlueI18n,
} = evenBiggerThanThatI18n.cards;
