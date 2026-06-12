import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainAmeliaFirstInCommandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Amelia",
    version: "First in Command",
    text: [
      {
        title: "DISCIPLINE",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Käpt'n Amelia",
    version: "Erste Offizierin",
    text: [
      {
        title: "DISZIPLIN",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Capitaine Amélia",
    version: "Commande le vaisseau",
    text: [
      {
        title: "DISCIPLINE",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Capitano Amelia",
    version: "Prima in Comando",
    text: [
      {
        title: "DISCIPLINA",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
