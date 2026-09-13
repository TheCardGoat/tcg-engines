import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reekOfCorruption } from "./reek-of-corruption.ts";

export const reekOfCorruptionI18n = defineFamilyI18n(reekOfCorruption, {
  en: {
    name: "Reek of Corruption",
    text: 'If you have played or created an aura this turn, Reek of Corruption gains "When this hits a hero, they discard a card."',
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: reekOfCorruptionRedI18n,
  yellow: reekOfCorruptionYellowI18n,
  blue: reekOfCorruptionBlueI18n,
} = reekOfCorruptionI18n.cards;
