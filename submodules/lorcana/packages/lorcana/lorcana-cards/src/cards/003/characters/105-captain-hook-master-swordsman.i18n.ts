import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookMasterSwordsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook",
    version: "Master Swordsman",
    text: [
      {
        title: "NEMESIS",
        description:
          "During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.",
      },
      {
        title: "MAN-TO-MAN",
        description: "Characters named Peter Pan lose Evasive and can't gain Evasive.",
      },
    ],
  },
  de: {
    name: "Käpt'n Hook",
    version: "Meisterhafter Schwertkämpfer",
    text: [
      {
        title: "NEMESIS",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
      {
        title: "MANN GEGEN MANN",
        description:
          "Alle Peter-Pan-Charaktere verlieren Wendig und können Wendig nicht mehr erhalten.",
      },
    ],
  },
  fr: {
    name: "Capitaine Crochet",
    version: "Maître épéiste",
    text: [
      {
        title: "NÉMÉSIS",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
      {
        title: "COMBAT SINGULIER",
        description:
          "Les personnages Peter Pan perdent Insaisissable et ne peuvent pas gagner Insaisissable.",
      },
    ],
  },
  it: {
    name: "Capitan Uncino",
    version: "Maestro Spadaccino",
    text: [
      {
        title: "NEMESI",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, preparalo. Non può andare all'avventura per il resto di questo turno.",
      },
      {
        title: "UOMO A UOMO I",
        description:
          "personaggi chiamati Peter Pan perdono Sfuggente e non possono ottenere Sfuggente.",
      },
    ],
  },
};
