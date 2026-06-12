import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clarabelleNewsReporterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clarabelle",
    version: "News Reporter",
    text: [
      {
        title: "Support",
      },
      {
        title: "BREAKING STORY",
        description: "Your other characters with Support get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Klarabella",
    version: "Nachrichtenreporterin",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "EILMELDUNG",
        description: "Deine anderen Charaktere mit Unterstützen erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Clarabelle",
    version: "Journaliste",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "SCOOP",
        description: "Vos autres personnages avec Soutien gagnent +1.",
      },
    ],
  },
  it: {
    name: "Clarabella",
    version: "Giornalista",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "NOTIZIA BOMBA",
        description: "I tuoi altri personaggi con Aiutante ricevono +1.",
      },
    ],
  },
};
