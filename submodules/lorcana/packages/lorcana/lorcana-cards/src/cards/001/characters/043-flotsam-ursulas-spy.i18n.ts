import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flotsamUrsulasSpyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flotsam",
    version: "Ursula’s Spy",
    text: [
      {
        title: "<Rush>",
      },
      {
        title: "Dexterous Lunge",
        description: "Your characters named Jetsam gain Rush.",
      },
    ],
  },
  de: {
    name: "Abschaum",
    version: "Ursulas Spion",
    text: "<Rasant> \\Flink und Hinterhältig\\ Deine Meerschaum-Charaktere erhalten Rasant.",
  },
  fr: {
    name: "FLOTSAM",
    version: "Espion d'Ursula",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "COUP BAS",
        description: "Vos personnages Jetsam gagnent Charge.",
      },
    ],
  },
  it: {
    name: "Flotsam",
    version: "Ursula’s Spy",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "Dexterous Lunge",
        description: "Your characters named Jetsam gain Rush.",
      },
    ],
  },
};
