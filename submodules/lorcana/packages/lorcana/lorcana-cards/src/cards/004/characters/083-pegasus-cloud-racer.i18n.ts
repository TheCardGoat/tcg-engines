import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pegasusCloudRacerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pegasus",
    version: "Cloud Racer",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Evasive",
      },
      {
        title: "HOP ON!",
        description:
          "When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Pegasus",
    version: "Wolkenflitzer",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Pegasus-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Spring auf!",
        description:
          "Falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, erhalten deine Charaktere bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Pégase",
    version: "Fait la course aux nuages",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Pégase.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "En selle!",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, vos personnages gagnent <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pegaso",
    version: "Calcanuvole",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Pegaso.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Salta su!",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, i tuoi personaggi ottengono <Sfuggente> fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Pegaso",
    version: "Corredor de nubes",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Evasivo",
      },
      {
        title: "¡SUBIR A!",
        description:
          "Cuando juegas con este personaje, si usaste Shift para interpretarlo, tus personajes obtienen Evasividad hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
