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
        title: "Mein Zuständigkeitsbereich",
        description: "In deinem Zug kann diesem Charakter kein Schaden zugefügt werden.",
      },
      {
        title: "Abordnen",
        description: "Deine anderen Charaktere erhalten die Klassifizierung Detektiv.",
      },
    ],
  },
  fr: {
    name: "Chef Bogo",
    version: "Prend les décisions",
    text: [
      {
        title: "Ma juridiction",
        description: "Durant votre tour, ce personnage ne peut pas subir de dommages.",
      },
      {
        title: "Nommer des adjoints",
        description: "Vos autres personnages gagnent la classification Détective.",
      },
    ],
  },
  it: {
    name: "Capitano Bogo",
    version: "Che Prende le Decisioni",
    text: [
      {
        title: "La Mia Giurisdizione",
        description: "Durante il tuo turno, questo personaggio non può subire danni.",
      },
      {
        title: "Incaricare",
        description: "I tuoi altri personaggi ottengono la classificazione Detective.",
      },
    ],
  },
};
