import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tempestAurora } from "./tempest-aurora.ts";

export const tempestAuroraI18n = defineFamilyI18n(tempestAurora, {
  en: {
    name: "Tempest Aurora",
    text: ({ costLimit }) =>
      `The next card you play this turn with cost ${costLimit} or less and an arcane damage effect, instead deals that much arcane damage plus 1.\nGo again`,
    typeText: "Wizard Action",
  },
});

export const {
  red: tempestAuroraRedI18n,
  yellow: tempestAuroraYellowI18n,
  blue: tempestAuroraBlueI18n,
} = tempestAuroraI18n.cards;
