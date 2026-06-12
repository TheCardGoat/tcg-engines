import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jetsamUrsulasBabyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jetsam",
    version: 'Ursula\'s "Baby"',
    text: [
      {
        title: "Challenger +2",
      },
      {
        title: "OMINOUS PAIR",
        description: "Your characters named Flotsam gain Challenger +2.",
      },
    ],
  },
  de: {
    name: "Meerschaum",
    version: 'Ursulas "Baby"',
    text: [
      {
        title: "Herausfordern +2",
      },
      {
        title: "UNHEIMLICHES DUO",
        description: "Deine Abschaum-Charaktere erhalten Herausfordern +2.",
      },
    ],
  },
  fr: {
    name: "Jetsam",
    version: '"Bébé" d\'Ursula',
    text: [
      {
        title: "Offensif +2",
      },
      {
        title: "DUO INQUIÉTANT",
        description: "Vos personnages Flotsam gagnent Offensif +2.",
      },
    ],
  },
  it: {
    name: "Jetsam",
    version: "“Piccino” di Ursula",
    text: [
      {
        title: "Sfidante +2",
      },
      {
        title: "COPPIA SINISTRA",
        description: "I tuoi personaggi chiamati Flotsam ottengono Sfidante +2.",
      },
    ],
  },
};
