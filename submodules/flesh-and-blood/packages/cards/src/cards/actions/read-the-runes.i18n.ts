import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { readTheRunes } from "./read-the-runes.ts";

export const readTheRunesI18n = defineFamilyI18n(readTheRunes, {
  en: {
    name: "Read the Runes",
    text: (count) =>
      `Create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}.`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: readTheRunesRedI18n,
  yellow: readTheRunesYellowI18n,
  blue: readTheRunesBlueI18n,
} = readTheRunesI18n.cards;
