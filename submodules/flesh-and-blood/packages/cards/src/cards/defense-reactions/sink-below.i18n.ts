import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sinkBelow } from "./sink-below.ts";

export const sinkBelowI18n = defineFamilyI18n(sinkBelow, {
  en: {
    name: "Sink Below",
    text: "You may put a card from your hand on the bottom of your deck. If you do, draw a card.",
    typeText: "Generic Defense Reaction",
  },
});

export const {
  red: sinkBelowRedI18n,
  yellow: sinkBelowYellowI18n,
  blue: sinkBelowBlueI18n,
} = sinkBelowI18n.cards;
