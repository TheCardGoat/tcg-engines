import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellPeterPansAllyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Peter Pan’s Ally",
    text: [
      {
        title: "<Evasive>",
      },
      {
        title: "Loyal and Devoted",
        description:
          "Your characters named Peter Pan gain <Challenger> +1. (They get +1 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Peter Pans Verbündete",
    text: "<Wendig> \\Loyal und Hingebungsvoll\\ Deine Peter-Pan-Charaktere erhalten <Herausfordern> +1. (Während sie herausfordern, erhalten sie +1 {S}.)",
  },
  fr: {
    name: "LA FÉE CLOCHETTE",
    version: "Alliée de Peter Pan",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "LOYALE ET DÉVOUÉE",
        description:
          "Vos personnages Peter Pan gagnent <Offensif> + 1. (Ils gagnent +1 {S} lorsqu'ils défient.)",
      },
    ],
  },
  it: {
    name: "Tinker Bell",
    version: "Peter Pan’s Ally",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Loyal and Devoted",
        description:
          "Your characters named Peter Pan gain <Challenger> +1. (They get +1 {S} while challenging.)",
      },
    ],
  },
  es: {
    name: "Campanita",
    version: "El aliado de Peter Pan",
    text: [
      {
        title: "<Evasivo>",
      },
      {
        title: "Leal y devoto",
        description:
          "Tus personajes llamados Peter Pan obtienen <Challenger> +1. (Obtienen +1 {S} mientras desafían).",
      },
    ],
  },
};
