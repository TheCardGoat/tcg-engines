import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { meatAndGreet } from "./meat-and-greet.ts";

export const meatAndGreetI18n = defineFamilyI18n(meatAndGreet, {
  en: {
    name: "Meat and Greet",
    text: "When this hits, create a Runechant token.\nIf you've dealt arcane damage to an opposing hero this turn, this gets go again.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: meatAndGreetRedI18n,
  yellow: meatAndGreetYellowI18n,
  blue: meatAndGreetBlueI18n,
} = meatAndGreetI18n.cards;
