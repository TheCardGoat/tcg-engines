import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const swordInTheStoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sword in the Stone",
    text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  },
  de: {
    name: "Das Schwert in dem Stein",
    text: ", 2 — Gib einem Charakter deiner Wahl in diesem Zug +1 für jeden Schaden auf ihm.",
  },
  fr: {
    name: "L'épée dans l'enclume",
    text: ", 2 — Choisissez un personnage, il gagne +1 pour chaque jeton Dommage sur lui, pour le reste de ce tour.",
  },
  it: {
    name: "Sword in the Stone",
    text: ", 2 — Chosen character gets +1 this turn for each 1 damage on them.",
  },
};
