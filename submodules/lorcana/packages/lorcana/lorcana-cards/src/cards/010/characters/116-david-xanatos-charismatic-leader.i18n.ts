import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const davidXanatosCharismaticLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "David Xanatos",
    version: "Charismatic Leader",
    text: [
      {
        title: "LEARN FROM EVERYTHING",
        description: "During your turn, whenever one of your characters is banished, draw a card.",
      },
      {
        title: "WHAT ARE YOU WAITING FOR?",
        description:
          "Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "David Xanatos",
    version: "Charismatischer Anführer",
    text: [
      {
        title: "AUS ALLEM LERNEN",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner Charaktere verbannt wird, ziehe 1 Karte.",
      },
      {
        title: "WORAUF WARTEST DU NOCH?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhält ein Charakter deiner Wahl in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "David Xanatos",
    version: "Leader charismatique",
    text: [
      {
        title: "TIRER DES LEÇONS DE TOUT",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages est banni, piochez une carte.",
      },
      {
        title: "QU'ATTENDEZ-VOUS?",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage qui gagne Charge pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "David Xanatos",
    version: "Leader Carismatico",
    text: [
      {
        title: "IMPARARE DA OGNI COSA",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi viene esiliato, pesca una carta.",
      },
      {
        title: "CHE COSA STAI ASPETTANDO?",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio a tua scelta ottiene Lesto per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
