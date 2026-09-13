import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reinforceTheLine } from "./reinforce-the-line.ts";

export const reinforceTheLineI18n = defineFamilyI18n(reinforceTheLine, {
  en: {
    name: "Reinforce the Line",
    typeText: "Generic Instant",
    text: (amount) => `Target defending attack action card gets +${amount}{d}.`,
  },
});

export const {
  red: reinforceTheLineRedI18n,
  yellow: reinforceTheLineYellowI18n,
  blue: reinforceTheLineBlueI18n,
} = reinforceTheLineI18n.cards;
