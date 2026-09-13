import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spearsOfSurreality } from "./spears-of-surreality.ts";

export const spearsOfSurrealityI18n = defineFamilyI18n(spearsOfSurreality, {
  en: {
    name: "Spears of Surreality",
    typeText: "Illusionist Action - Attack",
    text: "Phantasm\nGo again",
  },
});

export const {
  red: spearsOfSurrealityRedI18n,
  yellow: spearsOfSurrealityYellowI18n,
  blue: spearsOfSurrealityBlueI18n,
} = spearsOfSurrealityI18n.cards;
