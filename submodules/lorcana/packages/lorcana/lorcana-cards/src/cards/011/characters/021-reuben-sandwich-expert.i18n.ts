import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const reubenSandwichExpertI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Reuben",
    version: "Sandwich Expert",
    text: [
      {
        title: "LUNCH SPECIAL",
        description:
          "{E} — Remove up to 2 damage from chosen character of yours. For each 1 damage removed this way, you pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Reuben",
    version: "Sandwich-Experte",
    text: [
      {
        title: "SPEZIALMITTAGESSEN",
        description:
          "— Entferne bis zu 2 Schaden von einem deiner Charaktere. Du zahlst für jeden Schaden, den du auf diese Weise entfernt hast, 1 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Reuben",
    version: "Expert en sandwichs",
    text: [
      {
        title: "SPÉCIALITÉ DU JOUR",
        description:
          "— Choisissez l'un de vos personnages et retirez-lui jusqu'à 2 dommages. Pour chaque dommage ainsi retiré, le prochain personnage que vous jouez ce tour-ci vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Reuben",
    version: "Esperto di Panini",
    text: [
      {
        title: "SPECIALITÀ DEL PRANZO",
        description:
          "— Rimuovi fino a 2 danni da un tuo personaggio a tua scelta. Per ogni singolo danno rimosso in questo modo, paga 1 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
