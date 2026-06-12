import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefBogoCallingTheShotsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief Bogo",
    version: "Calling the Shots",
    text: [
      {
        title: "MY JURISDICTION",
        description: "During your turn, this character can't be dealt damage.",
      },
      {
        title: "DEPUTIZE",
        description: "Your other characters gain the Detective classification.",
      },
    ],
  },
  de: {
    name: "Chief Bogo",
    version: "Gibt den Ton an",
    text: [
      {
        title: "MEIN ZUSTÄNDIGKEITSBEREICH",
        description: "In deinem Zug erhält dieser Charakter keinen Schaden.",
      },
      {
        title: "ABORDNEN",
        description: "Deine anderen Charaktere erhalten die Klassifizierung Detektiv.",
      },
    ],
  },
  fr: {
    name: "Chef Bogo",
    version: "Prend les décisions",
    text: [
      {
        title: "MA JURIDICTION",
        description: "Durant votre tour, ce personnage ne peut pas subir de dommages.",
      },
      {
        title: "NOMMER DES ADJOINTS",
        description: "Vos autres personnages gagnent la classification Détective.",
      },
    ],
  },
  it: {
    name: "Capitano Bogo",
    version: "Che Prende le Decisioni",
    text: [
      {
        title: "LA MIA GIURISDIZIONE",
        description: "Durante il tuo turno, questo personaggio non può subire danni.",
      },
      {
        title: "INCARICARE I",
        description: "tuoi altri personaggi ottengono la classificazione Detective.",
      },
    ],
  },
};
