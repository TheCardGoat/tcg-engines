import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const foodFightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Food Fight!",
    text: 'Your characters gain "{E}, 1 {I} — Deal 1 damage to chosen character" this turn.',
  },
  de: {
    name: "Essensschlacht!",
    text: 'Deine Charaktere erhalten in diesem Zug: ", 1 — Füge einem Charakter deiner Wahl 1 Schaden zu."',
  },
  fr: {
    name: "Bataille de nourriture !",
    text: 'Vos personnages gagnent ", 1 — Choisissez un personnage et infligez-lui 1 dommage." pour le reste de ce tour.',
  },
  it: {
    name: "Battaglia di Cibo!",
    text: [
      {
        title: "I",
        description:
          'tuoi personaggi ottengono ", 1 — Infliggi 1 danno a un personaggio a tua scelta" per questo turno.',
      },
    ],
  },
};
