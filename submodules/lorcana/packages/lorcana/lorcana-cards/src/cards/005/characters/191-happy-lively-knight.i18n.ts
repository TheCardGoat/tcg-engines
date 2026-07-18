import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const happyLivelyKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Happy",
    version: "Lively Knight",
    text: [
      {
        title: "BURST OF SPEED",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Happy",
    version: "Ritter der Lebensfreude",
    text: [
      {
        title: "Geschwindigkeitsschub",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Joyeux",
    version: "Chevalier guilleret",
    text: [
      {
        title: "Rapide comme l'éclair",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Gongolo",
    version: "Cavaliere Allegro",
    text: [
      {
        title: "Scatto Veloce",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Feliz",
    version: "Caballero animado",
    text: [
      {
        title: "ARRANCADA",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
