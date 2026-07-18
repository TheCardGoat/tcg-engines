import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fatCatCriminalBusinessmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fat Cat",
    version: "Criminal Businessman",
    text: [
      {
        title: "WORTHY INVESTMENT",
        description: "Your locations gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Al Katzone",
    version: "Krimineller Geschäftsmann",
    text: [
      {
        title: "Wertvolle Investition",
        description:
          "Deine Orte erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Catox",
    version: "Homme d'affaires criminel",
    text: [
      {
        title: "Investissement rentable",
        description:
          "Vos lieux gagnent <Résistance> +1. (Les dommages infligés à ces lieux sont réduits de 1.)",
      },
    ],
  },
  it: {
    name: "Gattolardo",
    version: "Uomo d'Affari Criminale",
    text: [
      {
        title: "Investimento di Valore",
        description: "I tuoi luoghi ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Gato gordo",
    version: "Empresario criminal",
    text: [
      {
        title: "INVERSIÓN DIGNA",
        description: "Tus ubicaciones obtienen Resistencia +1.",
      },
    ],
  },
};
