import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const roseLanternI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rose Lantern",
    text: [
      {
        title: "MYSTICAL PETALS",
        description:
          "{E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Rosen-Laterne",
    text: [
      {
        title: "GEHEIMNISVOLLE",
        description:
          "BLÜTENBLÄTTER, 2 — Verschiebe 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Rose-Lanterne",
    text: [
      {
        title: "PÉTALES MYSTIQUES,",
        description:
          "2 — Choisissez un personnage et déplacez 1 de ses jetons Dommage sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Lanterna della Rosa",
    text: [
      {
        title: "PETALI MISTICI, 2",
        description:
          "— Sposta 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
