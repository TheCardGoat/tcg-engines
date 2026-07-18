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
        title: "Aus allem lernen",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner Charaktere verbannt wird, ziehe 1 Karte.",
      },
      {
        title: "Worauf wartest du noch?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhält ein Charakter deiner Wahl in diesem Zug <Rasant>. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "David Xanatos",
    version: "Leader charismatique",
    text: [
      {
        title: "Tirer des leçons de tout",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages est banni, piochez une carte.",
      },
      {
        title: "Qu'attendez-vous?",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage qui gagne <Charge> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "David Xanatos",
    version: "Leader Carismatico",
    text: [
      {
        title: "Imparare da Ogni Cosa",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi viene esiliato, pesca una carta.",
      },
      {
        title: "Che Cosa Stai Aspettando?",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio a tua scelta ottiene <Lesto> per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "David Xánatos",
    version: "Líder carismático",
    text: [
      {
        title: "APRENDE DE TODO",
        description:
          "Durante tu turno, cada vez que uno de tus personajes sea desterrado, roba una carta.",
      },
      {
        title: "¿A QUÉ ESTÁS ESPERANDO?",
        description:
          "Siempre que este personaje realice una misión, el personaje elegido gana Rush este turno. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
