import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { angelicDescent } from "./angelic-descent.ts";

export const angelicDescentI18n = defineFamilyI18n(angelicDescent, {
  en: {
    name: "Angelic Descent",
    typeText: "Light Illusionist Instant",
    text: (amount) =>
      `Target attack action card with Herald in its name gets go again.\nYour next angel attack this turn gets +${amount}{p}.`,
  },
});

export const {
  red: angelicDescentRedI18n,
  yellow: angelicDescentYellowI18n,
  blue: angelicDescentBlueI18n,
} = angelicDescentI18n.cards;
