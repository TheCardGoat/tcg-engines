import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const walkThePlankI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Walk the Plank!",
    text: 'Your Pirate characters gain "{E} — Banish chosen damaged character" this turn.',
  },
  de: {
    name: "Über die Planke!",
    text: 'Deine Piraten erhalten in diesem Zug: " — Verbanne einen beschädigten Charakter deiner Wahl."',
  },
  fr: {
    name: "Sur la planche !",
    text: 'Vos personnages Pirate gagnent " — Choisissez un personnage avec un dommage ou plus et bannissez-le." pour le reste de ce tour.',
  },
  it: {
    name: "Sull'Asse!",
    text: [
      {
        title: "I",
        description:
          'tuoi personaggi Pirata ottengono " — Esilia un personaggio danneggiato a tua scelta" per questo turno.',
      },
    ],
  },
};
