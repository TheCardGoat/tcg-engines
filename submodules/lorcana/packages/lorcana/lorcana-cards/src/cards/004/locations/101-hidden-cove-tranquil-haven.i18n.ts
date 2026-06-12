import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hiddenCoveTranquilHavenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hidden Cove",
    version: "Tranquil Haven",
    text: [
      {
        title: "REVITALIZING WATERS",
        description: "Characters get +1 {S} and +1 {W} while here.",
      },
    ],
  },
  de: {
    name: "Versteckte Grotte",
    version: "Ruhiger Hafen",
    text: [
      {
        title: "BELEBENDE GEWÄSSER",
        description: "Charaktere an diesem Ort erhalten +1 und +1.",
      },
    ],
  },
  fr: {
    name: "La crique cachée",
    version: "Havre de paix",
    text: [
      {
        title: "EAUX REVITALISANTES",
        description: "Les personnages sur ce lieu gagnent +1 et +1.",
      },
    ],
  },
  it: {
    name: "Cala Nascosta",
    version: "Porto Sicuro",
    text: [
      {
        title: "ACQUE RIVITALIZZANTI I",
        description: "personaggi ricevono +1 e +1 mentre si trovano in questo luogo.",
      },
    ],
  },
};
