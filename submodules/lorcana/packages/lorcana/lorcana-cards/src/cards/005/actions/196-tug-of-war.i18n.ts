import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tugofwarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tug-of-War",
    text: [
      {
        title: "Choose one:",
      },
      {
        title: "• Deal 1 damage to each opposing character without Evasive.",
      },
      {
        title: "• Deal 3 damage to each opposing character with Evasive.",
      },
    ],
  },
  de: {
    name: "Tauziehen",
    text: "Wähle eine Möglichkeit aus: • Füge jedem gegnerischen Charakter ohne Wendig 1 Schaden zu. • Füge jedem gegnerischen Charakter mit Wendig 3 Schaden zu.",
  },
  fr: {
    name: "Tir à la corde",
    text: "Choisissez entre: • Infligez 1 dommage à chaque personnage adverse sans Insaisissable. • Infligez 3 dommages à chaque personnage adverse avec Insaisissable.",
  },
  it: {
    name: "Tiro alla Fune",
    text: "Scegli uno: • Infliggi 1 danno a ogni personaggio avversario senza Sfuggente. • Infliggi 3 danni a ogni personaggio avversario con Sfuggente.",
  },
};
