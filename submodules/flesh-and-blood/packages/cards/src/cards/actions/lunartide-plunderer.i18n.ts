import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lunartidePlunderer } from "./lunartide-plunderer.ts";

export const lunartidePlundererI18n = defineFamilyI18n(lunartidePlunderer, {
  en: {
    name: "Lunartide Plunderer",
    text: "If Lunartide Plunderer hits a hero, banish it and a card from their soul.",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: lunartidePlundererRedI18n,
  yellow: lunartidePlundererYellowI18n,
  blue: lunartidePlundererBlueI18n,
} = lunartidePlundererI18n.cards;
