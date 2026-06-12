import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jingleJoeSidsToyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jingle Joe",
    version: "Sid's Toy",
    text: [
      {
        title: "Turn Out the Light",
        description:
          "During your turn, whenever one of your other Toy characters is banished, chosen character of yours gains <Evasive> until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Jingle Joe",
    version: "Sids Spielzeug",
    text: [
      {
        title: "Mach das Licht aus",
        description:
          "Jedes Mal, wenn eines deiner anderen Spielzeuge in deinem Zug verbannt wird, wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Jingle Joe",
    version: "Jouet de Sid",
    text: [
      {
        title: "Éteindre la lumière",
        description:
          "Durant votre tour, chaque fois que l'un de vos autres personnages Jouet est banni, choisissez l'un de vos personnages qui gagne <Insaisissable> jusqu'au début de votre prochain tour. (Seuls les personnages avec Insaisissable peuvent défier ce personnage-là.)",
      },
    ],
  },
  it: {
    name: "Jingle Joe",
    version: "Giocattolo di Sid",
    text: [
      {
        title: "Spegni la Luce",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi Giocattolo viene esiliato, un tuo personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
