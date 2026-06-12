import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const neroFearsomeCrocodileI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nero",
    version: "Fearsome Crocodile",
    text: [
      {
        title: "AND MEAN",
        description:
          "{E} — Move 1 damage counter from this character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Nero, das Krokodil",
    version: "Furchteinflößendes Krokodil",
    text: [
      {
        title: "UND GEMEIN",
        description:
          "— Verschiebe 1 Schadensmarker von diesem Charakter zu einem gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Néron",
    version: "Redoutable crocodile",
    text: [
      {
        title: "ET MESQUIN",
        description:
          "— Déplacez 1 dommage de ce personnage-ci sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Nerone",
    version: "Coccodrillo Spaventoso",
    text: [
      {
        title: "E CATTIVO",
        description:
          "— Sposta 1 segnalino danno da questo personaggio a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
