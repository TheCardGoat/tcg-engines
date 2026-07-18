import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauisPlaceOfExileHiddenIslandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui's Place of Exile",
    version: "Hidden Island",
    text: [
      {
        title: "ISOLATED",
        description: "Characters gain Resist +1 while here.",
      },
    ],
  },
  de: {
    name: "Mauis Insel im Exil",
    version: "Verborgene Insel",
    text: [
      {
        title: "Isoliert",
        description:
          "Charaktere an diesem Ort erhalten <Robust> +1. (Reduziere jeglichen Schaden, der den Charakteren zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Île d'exil de Maui",
    version: "Rocher caché",
    text: [
      {
        title: "Isolé",
        description: "Les personnages sur ce lieu gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Luogo dell'Esilio di Maui",
    version: "Isola Nascosta",
    text: [
      {
        title: "Isolata",
        description: "I personaggi ottengono <Resistere> +1 mentre si trovano in questo luogo.",
      },
    ],
  },
  es: {
    name: "El lugar de exilio de Maui",
    version: "Isla escondida",
    text: [
      {
        title: "AISLADO",
        description: "Los personajes obtienen Resistencia +1 mientras están aquí.",
      },
    ],
  },
};
