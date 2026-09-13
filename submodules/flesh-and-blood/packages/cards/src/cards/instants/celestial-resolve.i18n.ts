import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { celestialResolve } from "./celestial-resolve.ts";

export const celestialResolveI18n = defineFamilyI18n(celestialResolve, {
  en: {
    name: "Celestial Resolve",
    typeText: "Light Illusionist Instant",
    text: (amount) => `Target attack action card with Herald in its name gets +${amount}{d}.`,
  },
});

export const {
  red: celestialResolveRedI18n,
  yellow: celestialResolveYellowI18n,
  blue: celestialResolveBlueI18n,
} = celestialResolveI18n.cards;
