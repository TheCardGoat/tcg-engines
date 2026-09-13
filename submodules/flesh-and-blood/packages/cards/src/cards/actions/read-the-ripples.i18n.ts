import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { readTheRipples } from "./read-the-ripples.ts";

export const readTheRipplesI18n = defineFamilyI18n(readTheRipples, {
  en: {
    name: "Read the Ripples",
    text: (_parameter, color) =>
      `At the beginning of your end phase, destroy Read the Ripples then ${color === "red" ? "opt 1" : color === "yellow" ? "opt 1, opt 1, opt 1" : "opt 1, opt 1"}, and draw a card.`,
    typeText: "Wizard Action - Aura",
  },
});

export const {
  red: readTheRipplesRedI18n,
  yellow: readTheRipplesYellowI18n,
  blue: readTheRipplesBlueI18n,
} = readTheRipplesI18n.cards;
