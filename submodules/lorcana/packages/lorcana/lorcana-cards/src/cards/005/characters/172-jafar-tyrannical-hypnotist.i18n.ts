import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarTyrannicalHypnotistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Tyrannical Hypnotist",
    text: [
      {
        title: "Challenger +7",
      },
      {
        title: "INTIMIDATING GAZE",
        description: "Opposing characters with cost 4 or less can't challenge.",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Tyrannischer Hypnosekünstler",
    text: [
      {
        title: "<Herausfordern> +7 (Während dieser Charakter herausfordert, erhält er +7 {S}.)",
      },
      {
        title: "Einschüchternder Blick",
        description:
          "Gegnerische Charaktere, die 4 oder weniger kosten, können nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Hypnotiseur tyrannique",
    text: [
      {
        title: "<Offensif> +7",
      },
      {
        title: "Regard intimidant",
        description: "Les personnages adverses coûtant 4 ou moins ne peuvent pas défier.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Ipnotizzatore Tirannico",
    text: [
      {
        title: "<Sfidante> +7",
      },
      {
        title: "Sguardo Intimidatorio",
        description: "I personaggi avversari con costo 4 o inferiore non possono sfidare.",
      },
    ],
  },
  es: {
    name: "Jafar",
    version: "Hipnotizador tiránico",
    text: [
      {
        title: "Retador +7",
      },
      {
        title: "MIRADA INTIMIDADORA",
        description: "Los personajes contrarios con coste 4 o menos no pueden desafiar.",
      },
    ],
  },
};
