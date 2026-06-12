import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ticktockRelentlessCrocodileI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tick-Tock",
    version: "Relentless Crocodile",
    text: [
      {
        title: "LOOKING FOR LUNCH",
        description:
          "During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Ticktack",
    version: "Unerbittliches Krokodil",
    text: [
      {
        title: "SUCHT NACH ESSEN",
        description:
          "Solange ein Pirat im Spiel ist, erhält dieser Charakter in deinem Zug Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Tic-Tac",
    version: "Crocodile acharné",
    text: [
      {
        title: "EN QUÊTE D'UN REPAS",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable tant qu'il y a un personnage Pirate en jeu. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Cocò",
    version: "Coccodrillo Implacabile",
    text: [
      {
        title: "IN CERCA DI UNO SPUNTINO",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente mentre un personaggio Pirata è in gioco. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
