import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomAerialCleanerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Aerial Cleaner",
    text: [
      {
        title: "WINGED FOR",
        description:
          "A DAY During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Luftreiniger",
    text: [
      {
        title: "Für einen Tag beflügelt",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Balais Magiques",
    version: "Nettoyeur aérien",
    text: [
      {
        title: "Ailé pour un jour",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Pulitrice Volante",
    text: [
      {
        title: "Alata per un Giorno",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Escoba magica",
    version: "Limpiador aéreo",
    text: [
      {
        title: "ALADO PARA",
        description:
          "UN DÍA Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
