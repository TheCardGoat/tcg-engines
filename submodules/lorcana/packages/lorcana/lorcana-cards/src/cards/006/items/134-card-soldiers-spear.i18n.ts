import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cardSoldiersSpearI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Card Soldier's Spear",
    text: [
      {
        title: "A SUITABLE WEAPON",
        description: "Your damaged characters get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Speer des Kartensoldaten",
    text: [
      {
        title: "EINE GEEIGNETE WAFFE",
        description: "Deine beschädigten Charaktere erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Lance de Garde carte",
    text: [
      {
        title: "UNE ARME CONVENABLE",
        description: "Vos personnages ayant au moins 1 dommage sur eux gagnent +1.",
      },
    ],
  },
  it: {
    name: "Lancia della Carta Soldato",
    text: [
      {
        title: "UN'ARMA ASSOLUTA I",
        description: "tuoi personaggi danneggiati ricevono +1.",
      },
    ],
  },
};
