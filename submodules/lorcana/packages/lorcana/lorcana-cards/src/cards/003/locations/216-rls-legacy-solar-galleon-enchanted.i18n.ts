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
        title: "DAS IST UNSER SCHIFF",
        description:
          "Charaktere an diesem Ort erhalten Wendig. (Nur Charaktere mit Wendig können diese Charaktere herausfordern.)",
      },
      {
        title: "LANGSAM ABLASSEN",
        description:
          "Wenn du mindestens einen Charakter an diesem Ort hast, zahlst du 2 weniger, um Charaktere an diesen Ort zu bewegen.",
      },
    ],
  },
  fr: {
    name: "RLS Héritage",
    version: "Galion solaire",
    text: [
      {
        title: "C'EST NOTRE BATEAU",
        description:
          "Les personnages sur ce lieu gagnent Insaisissable. (Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
      },
      {
        title: "NE TRAVAILLEZ PAS LES UNS CONTRE LES AUTRES",
        description:
          "Tant que l'un de vos personnages se trouve sur ce lieu, y déplacer un personnage vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "RLS Legacy",
    version: "Galeone Solare",
    text: [
      {
        title: "QUESTA È LA NOSTRA NAVE I",
        description:
          "personaggi ottengono Sfuggente mentre si trovano in questo luogo. (Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
      {
        title: "TIRATE TUTTI INSIEME",
        description:
          "Se hai un personaggio in questo luogo, paga 2 in meno per spostare un tuo personaggio in questo luogo.",
      },
    ],
  },
};
