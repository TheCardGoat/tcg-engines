import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tripTheLightFantastic } from "./trip-the-light-fantastic.ts";

export const tripTheLightFantasticI18n = defineFamilyI18n(tripTheLightFantastic, {
  en: {
    name: "Trip the Light Fantastic",
    typeText: "Lightning Action - Attack",
    text: "Instant - Discard this: Prevent the next 2 damage that would be dealt to you this turn.",
  },
});

export const {
  red: tripTheLightFantasticRedI18n,
  yellow: tripTheLightFantasticYellowI18n,
  blue: tripTheLightFantasticBlueI18n,
} = tripTheLightFantasticI18n.cards;
