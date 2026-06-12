import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const imperialBowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Imperial Bow",
    text: [
      {
        title: "WITHIN RANGE",
        description:
          "{E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Kaiserlicher Bogen",
    text: [
      {
        title: "IN REICHWEITE, 1",
        description:
          "— Ein Held oder eine Heldin deiner Wahl erhält in diesem Zug Herausfordern +2 und Wendig. (Während der Charakter herausfordert, erhält er +2. Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Arc Impérial",
    text: [
      {
        title: "À PORTÉE DE TIR,",
        description:
          "1 — Choisissez un personnage Héros qui gagne Offensif +2 et Insaisissable pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne +2. Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Arco Imperiale",
    text: [
      {
        title: "ENTRO GITTATA, 1",
        description:
          "— Un personaggio Eroe a tua scelta ottiene Sfidante +2 e Sfuggente per questo turno. (Riceve +2 mentre sta sfidando. Può sfidare i personaggi con Sfuggente.)",
      },
    ],
  },
};
