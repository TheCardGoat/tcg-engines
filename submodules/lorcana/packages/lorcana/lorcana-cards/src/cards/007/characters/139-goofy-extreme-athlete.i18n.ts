import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyExtremeAthleteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Extreme Athlete",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "STAR POWER",
        description:
          "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Extremsportler",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Macht der Berühmtheit",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, erhalten deine anderen Charaktere in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Athlète de l'extrême",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Pouvoir de Star",
        description:
          "Chaque fois que ce personnage en défie un autre, vos autres personnages gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Atleta Estremo",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Talento da Star",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, i tuoi altri personaggi ricevono +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Mentecato",
    version: "Atleta extremo",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "PODER DE ESTRELLA",
        description:
          "Cada vez que este personaje desafía a otro personaje, tus otros personajes obtienen +1 {L} este turno.",
      },
    ],
  },
};
