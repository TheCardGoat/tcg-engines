import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pouncingPracticeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pouncing Practice",
    text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)",
  },
  de: {
    name: "Springen üben",
    text: "Gib einem Charakter deiner Wahl in diesem Zug -2. Wähle einen deiner Charaktere. Jener erhält in diesem Zug Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
  },
  fr: {
    name: "Entraînement au bond",
    text: "Choisissez un personnage qui subit -2 pour le reste de ce tour. Choisissez l'un de vos personnages qui gagne Insaisissable pour le reste de ce tour. (Il peut défier des personnages avec Insaisissable.)",
  },
  it: {
    name: "Lezione d'Agguato",
    text: "Un personaggio a tua scelta riceve -2 per questo turno. Un tuo personaggio a tua scelta ottiene Sfuggente per questo turno. (Può sfidare altri personaggi con Sfuggente.)",
  },
};
