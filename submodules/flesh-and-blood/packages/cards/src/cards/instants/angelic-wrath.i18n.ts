import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { angelicWrath } from "./angelic-wrath.ts";

export const angelicWrathI18n = defineFamilyI18n(angelicWrath, {
  en: {
    name: "Angelic Wrath",
    typeText: "Light Illusionist Instant",
    text: (amount) => `Target attack action card with Herald in its name gets +${amount}{p}`,
  },
});

export const {
  red: angelicWrathRedI18n,
  yellow: angelicWrathYellowI18n,
  blue: angelicWrathBlueI18n,
} = angelicWrathI18n.cards;
