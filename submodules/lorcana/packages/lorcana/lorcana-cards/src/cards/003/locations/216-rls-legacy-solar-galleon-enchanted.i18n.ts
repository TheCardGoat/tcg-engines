import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rlsLegacySolarGalleonEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "RLS Legacy",
    version: "Solar Galleon",
    text: [
      {
        title: "THIS IS OUR SHIP",
        description: "Characters gain Evasive while here.",
      },
      {
        title: "HEAVE TOGETHER NOW",
        description:
          "If you have a character here, you pay 2 {I} less to move a character of yours here.",
      },
    ],
  },
  de: {
    name: "RLS Legacy",
    version: "Sonnen-Galeone",
    text: [
      {
        title: "Das ist unser Schiff",
        description:
          "Charaktere an diesem Ort erhalten <Wendig>. (Nur Charaktere mit Wendig können diese Charaktere herausfordern.)",
      },
      {
        title: "Langsam ablassen",
        description:
          "Wenn du mindestens einen Charakter an diesem Ort hast, zahlst du 2 {I} weniger, um Charaktere an diesen Ort zu bewegen.",
      },
    ],
  },
  fr: {
    name: "RLS Héritage",
    version: "Galion solaire",
    text: [
      {
        title: "C'est notre bateau",
        description:
          "Les personnages sur ce lieu gagnent <Insaisissable>. (Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
      },
      {
        title: "Ne travaillez pas les uns contre les autres",
        description:
          "Tant que l'un de vos personnages se trouve sur ce lieu, y déplacer un personnage vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "RLS Legacy",
    version: "Galeone Solare",
    text: [
      {
        title: "Questa è la Nostra Nave",
        description:
          "I personaggi ottengono <Sfuggente> mentre si trovano in questo luogo. (Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
      {
        title: "Tirate Tutti Insieme",
        description:
          "Se hai un personaggio in questo luogo, paga 2 {I} in meno per spostare un tuo personaggio in questo luogo.",
      },
    ],
  },
  es: {
    name: "Legado de RLS",
    version: "Galeón Solar",
    text: [
      {
        title: "ESTE ES NUESTRO BARCO",
        description: "Los personajes obtienen Evasión mientras están aquí.",
      },
      {
        title: "JUNTOS AHORA",
        description:
          "Si tienes un personaje aquí, pagas 2 {I} menos para mover un personaje tuyo aquí.",
      },
    ],
  },
};
