import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const swordInTheStoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sword in the Stone",
    text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  },
  de: {
    name: "Das Schwert in dem Stein",
    text: "{E}, 2 {I} — Gib einem Charakter deiner Wahl in diesem Zug +1 {S} für jeden Schaden auf ihm.",
  },
  fr: {
    name: "L'épée dans l'enclume",
    text: "{E}, 2 {I} — Choisissez un personnage, il gagne +1 {S} pour chaque jeton Dommage sur lui, pour le reste de ce tour.",
  },
  it: {
    name: "Sword in the Stone",
    text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  },
};
