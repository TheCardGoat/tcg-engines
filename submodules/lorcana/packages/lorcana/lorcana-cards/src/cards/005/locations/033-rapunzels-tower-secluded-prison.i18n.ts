import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelsTowerSecludedPrisonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel's Tower",
    version: "Secluded Prison",
    text: [
      {
        title: "SAFE AND SOUND",
        description: "Characters get +3 {W} while here.",
      },
    ],
  },
  de: {
    name: "Rapunzels Turm",
    version: "Abgelegenes Gefängnis",
    text: [
      {
        title: "DAMIT DIR NICHTS GESCHIEHT",
        description: "Charaktere an diesem Ort erhalten +3.",
      },
    ],
  },
  fr: {
    name: "Tour de Raiponce",
    version: "Prison cachée",
    text: [
      {
        title: "POUR QU'IL NE T'ARRIVE RIEN",
        description: "Les personnages sur ce lieu gagnent +3.",
      },
    ],
  },
  it: {
    name: "Torre di Rapunzel",
    version: "Prigione Isolata",
    text: [
      {
        title: "VEGLIO SU DI TE I",
        description: "personaggi ricevono +3 mentre si trovano in questo luogo.",
      },
    ],
  },
};
