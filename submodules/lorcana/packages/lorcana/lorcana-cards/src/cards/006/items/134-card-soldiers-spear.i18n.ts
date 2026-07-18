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
        title: "Eine geeignete Waffe",
        description: "Deine beschädigten Charaktere erhalten +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Lance de Garde carte",
    text: [
      {
        title: "Une arme convenable",
        description: "Vos personnages ayant au moins 1 dommage sur eux gagnent +1 {S}.",
      },
    ],
  },
  it: {
    name: "Lancia della Carta Soldato",
    text: [
      {
        title: "Un'Arma Assoluta",
        description: "I tuoi personaggi danneggiati ricevono +1 {S}.",
      },
    ],
  },
  es: {
    name: "Lanza del soldado de cartas",
    text: [
      {
        title: "UN ARMA ADECUADA",
        description: "Tus personajes dañados obtienen +1 {S}.",
      },
    ],
  },
};
