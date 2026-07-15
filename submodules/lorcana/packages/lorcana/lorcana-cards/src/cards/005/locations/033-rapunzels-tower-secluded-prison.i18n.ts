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
        title: "Damit dir nichts geschieht",
        description: "Charaktere an diesem Ort erhalten +3 {W}.",
      },
    ],
  },
  fr: {
    name: "Tour de Raiponce",
    version: "Prison cachée",
    text: [
      {
        title: "Pour qu'il ne t'arrive rien",
        description: "Les personnages sur ce lieu gagnent +3 {W}.",
      },
    ],
  },
  it: {
    name: "Torre di Rapunzel",
    version: "Prigione Isolata",
    text: [
      {
        title: "Veglio su di Te",
        description: "I personaggi ricevono +3 {W} mentre si trovano in questo luogo.",
      },
    ],
  },
};
