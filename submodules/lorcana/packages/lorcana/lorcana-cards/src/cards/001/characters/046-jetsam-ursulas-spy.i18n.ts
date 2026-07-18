import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jetsamUrsulasSpyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jetsam",
    version: "Ursula’s Spy",
    text: [
      {
        title: "<Evasive>",
      },
      {
        title: "Sinister Slither",
        description: "Your characters named Flotsam gain Evasive.",
      },
    ],
  },
  de: {
    name: "Meerschaum",
    version: "Ursulas Spion",
    text: "<Wendig> \\Fies und Glitschig\\ Deine Abschaum-Charaktere erhalten Wendig.",
  },
  fr: {
    name: "JETSAM",
    version: "Espion d'Ursula",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "SINISTRE ONDULATION",
        description: "Vos personnages Flotsam gagnent Insaisissable.",
      },
    ],
  },
  it: {
    name: "Jetsam",
    version: "Ursula’s Spy",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Sinister Slither",
        description: "Your characters named Flotsam gain Evasive.",
      },
    ],
  },
  es: {
    name: "Echazón",
    version: "La espía de Úrsula",
    text: [
      {
        title: "<Evasivo>",
      },
      {
        title: "Deslizamiento siniestro",
        description: "Tus personajes llamados Flotsam obtienen Evasividad.",
      },
    ],
  },
};
