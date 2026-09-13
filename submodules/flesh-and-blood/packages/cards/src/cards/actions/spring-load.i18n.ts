import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { springLoad } from "./spring-load.ts";

export const springLoadI18n = defineFamilyI18n(springLoad, {
  en: {
    name: "Spring Load",
    text: ({ bonus }) => `When this attacks, if you have no cards in hand, it gains +${bonus}{p}.`,
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: springLoadRedI18n,
  yellow: springLoadYellowI18n,
  blue: springLoadBlueI18n,
} = springLoadI18n.cards;
