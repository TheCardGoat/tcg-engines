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
        title: "Disziplin",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Capitaine Amélia",
    version: "Commande le vaisseau",
    text: [
      {
        title: "Discipline",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Capitano Amelia",
    version: "Prima in Comando",
    text: [
      {
        title: "Disciplina",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Capitana amelia",
    version: "Primero al mando",
    text: [
      {
        title: "DISCIPLINA",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
