import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const duckForCoverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Duck for Cover!",
    text: "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)",
  },
  de: {
    name: "Duckt euch weg!",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Robust +1 und Wendig. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1. Er kann Charaktere mit Wendig herausfordern.)",
  },
  fr: {
    name: "Éviter le canardage",
    text: "Choisissez un personnage qui gagne Résistance +1 et Insaisissable pour le reste de ce tour. (Les dommages qui lui sont infligés sont réduits de 1 et il peut défier les personnages avec Insaisissable.)",
  },
  it: {
    name: "Al Riparo!",
    text: "Un personaggio a tua scelta ottiene Resistere +1 e Sfuggente per questo turno. (Il danno che gli viene inflitto è ridotto di 1. Può sfidare altri personaggi con Sfuggente.)",
  },
};
