import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fruitsOfTheForest } from "./fruits-of-the-forest.ts";

export const fruitsOfTheForestI18n = defineFamilyI18n(fruitsOfTheForest, {
  en: {
    name: "Fruits of the Forest",
    text: "Instant - Discard this: Gain 2{h}",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: fruitsOfTheForestRedI18n,
  yellow: fruitsOfTheForestYellowI18n,
  blue: fruitsOfTheForestBlueI18n,
} = fruitsOfTheForestI18n.cards;
