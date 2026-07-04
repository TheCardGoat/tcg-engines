import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jetsamRiffraffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jetsam",
    version: "Riffraff",
    text: [
      {
        title: "Ward",
      },
      {
        title: "EERIE PAIR",
        description: "Your characters named Flotsam gain Ward.",
      },
    ],
  },
  de: {
    name: "Meerschaum",
    version: "Fischabfall",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Unheimliches Paar",
        description: "Deine Abschaum-Charaktere erhalten <Behütet>.",
      },
    ],
  },
  fr: {
    name: "Jetsam",
    version: "Boule puante",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Sinistre duo",
        description: "Vos personnages Flotsam gagnent <Hors d'atteinte>.",
      },
    ],
  },
  it: {
    name: "Jetsam",
    version: "Marmaglia",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Coppia Inquietante",
        description: "I tuoi personaggi chiamati Flotsam ottengono <Protetto>.",
      },
    ],
  },
};
