import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimTinyAdversaryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Tiny Adversary",
    text: [
      {
        title: "Challenger +1",
      },
      {
        title: "ZIM ZABBERIM ZIM",
        description: "Your other characters gain Challenger +1.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Winzige Widersacherin",
    text: [
      {
        title: "<Herausfordern> +1 (Während dieser Charakter herausfordert, erhält er +1 {S}.)",
      },
      {
        title: "Simsalarimbim",
        description: "Deine anderen Charaktere erhalten <Herausfordern> +1.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "Minuscule adversaire",
    text: [
      {
        title: "<Offensif> +1",
      },
      {
        title: "Zim Zabberim Bim",
        description: "Vos autres personnages gagnent <Offensif> +1.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Minuscola Avversaria",
    text: [
      {
        title: "<Sfidante> +1",
      },
      {
        title: "Zum Parapim Pim",
        description: "I tuoi altri personaggi ottengono <Sfidante> +1.",
      },
    ],
  },
  es: {
    name: "Señora mim",
    version: "Pequeño adversario",
    text: [
      {
        title: "Retador +1",
      },
      {
        title: "ZIM ZABBERIM ZIM",
        description: "Tus otros personajes obtienen Challenger +1.",
      },
    ],
  },
};
