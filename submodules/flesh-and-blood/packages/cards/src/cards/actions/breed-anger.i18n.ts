import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { breedAnger } from "./breed-anger.ts";

export const breedAngerI18n = defineFamilyI18n(breedAnger, {
  en: {
    name: "Breed Anger",
    typeText: "Ninja Action - Attack",
    text: "Combo - When this attacks, if Crouching Tiger was the last attack this combat chain, this gets go again and create a Crouching Tiger in your banished zone. You may play it this turn.",
  },
});

export const {
  red: breedAngerRedI18n,
  yellow: breedAngerYellowI18n,
  blue: breedAngerBlueI18n,
} = breedAngerI18n.cards;
