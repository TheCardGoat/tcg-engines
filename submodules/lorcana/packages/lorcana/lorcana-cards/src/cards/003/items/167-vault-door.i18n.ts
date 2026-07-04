import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vaultDoorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vault Door",
    text: [
      {
        title: "SEALED AWAY",
        description: "Your locations and characters at locations gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Tresortür",
    text: [
      {
        title: "Weggesperrt",
        description:
          "Deine Orte und Charaktere an Orten erhalten <Robust> +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Porte du coffre",
    text: [
      {
        title: "Scellé",
        description: "Vos lieux et personnages sur des lieux gagnent <Résistance> +1",
      },
    ],
  },
  it: {
    name: "Porta Blindata",
    text: [
      {
        title: "Sigillato",
        description: "I tuoi luoghi e i tuoi personaggi in un luogo ottengono <Resistere> +1.",
      },
    ],
  },
};
