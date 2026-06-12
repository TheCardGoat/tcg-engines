import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shieldOfVirtueI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shield of Virtue",
    text: [
      {
        title: "FIREPROOF",
        description:
          "{E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Schild der Tugend",
    text: [
      {
        title: "FEUERFEST, 3",
        description:
          "— Mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "BOUCLIER DE VERTU",
    text: [
      {
        title: "À L'ÉPREUVE DU FEU,",
        description:
          "3 — Choisissez un personnage et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scudo di Virtù",
    text: [
      {
        title: "IGNIFUGO, 3",
        description:
          "— Prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
