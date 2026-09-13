import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { evergreen } from "./evergreen.ts";

export const evergreenI18n = defineFamilyI18n(evergreen, {
  en: {
    name: "Evergreen",
    text: "If Evergreen is played from arsenal, put it on the bottom of its owner's deck when the combat chain closes.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: evergreenRedI18n,
  yellow: evergreenYellowI18n,
  blue: evergreenBlueI18n,
} = evergreenI18n.cards;
