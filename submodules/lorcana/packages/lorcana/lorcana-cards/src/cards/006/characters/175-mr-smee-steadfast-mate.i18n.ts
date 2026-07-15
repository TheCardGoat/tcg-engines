import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrSmeeSteadfastMateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mr. Smee",
    version: "Steadfast Mate",
    text: [
      {
        title: "GOOD CATCH",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Herr Smee",
    version: "Entschlossener Maat",
    text: [
      {
        title: "Guter Fang",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Monsieur Mouche",
    version: "Matelot fidèle",
    text: [
      {
        title: "Belle prise",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Spugna",
    version: "Leale Nostromo",
    text: [
      {
        title: "Bel Colpo",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
