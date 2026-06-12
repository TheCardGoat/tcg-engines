import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomAerialCleanerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Aerial Cleaner",
    text: [
      {
        title: "WINGED FOR A DAY",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Luftreiniger",
    text: [
      {
        title: "FÜR EINEN TAG BEFLÜGELT",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Balais Magiques",
    version: "Nettoyeur aérien",
    text: [
      {
        title: "AILÉ POUR UN JOUR",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Pulitrice Volante",
    text: [
      {
        title: "ALATA PER UN GIORNO",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
