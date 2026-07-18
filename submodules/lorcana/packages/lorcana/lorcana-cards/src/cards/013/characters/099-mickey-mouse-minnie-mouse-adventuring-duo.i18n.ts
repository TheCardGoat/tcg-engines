import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseMinnieMouseAdventuringDuoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse & Minnie Mouse",
    version: "Adventuring Duo",
    text: [
      {
        title:
          "<Duo Shift> 0 {I} (You may pay 0 {I} to play this on top of two of your characters, one named Mickey Mouse and one named Minnie Mouse.)",
      },
      {
        title: "Thinking of You",
        description:
          "If this character would be banished, put them into your inkwell facedown and exerted instead.",
      },
    ],
  },
  de: {
    name: "Micky Maus & Minnie Maus",
    version: "Abenteuerlustiges Duo",
    text: [
      {
        title:
          "<Duo-Gestaltwandel> 0 {I} (Du kannst 0 {I} zahlen, um diesen Charakter auf zwei deiner Charaktere auszuspielen, einen namens Micky Maus und einen namens Minnie Maus.)",
      },
      {
        title: "Ich denke an dich",
        description:
          "Falls dieser Charakter verbannt werden würde, lege ihn stattdessen verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse & Minnie",
    version: "Duo d'aventuriers",
    text: [
      {
        title: "<Alter Duo> 0 {I}",
      },
      {
        title: "Penser à vous",
        description:
          "Si ce personnage devait être banni, placez-le dans votre réserve d'encre à la place, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Topolino e Minni",
    version: "Duo Avventuroso",
    text: [
      {
        title:
          "<Trasformazione Duo> 0 {I} (Puoi pagare 0 {I} per giocare questa carta sopra a due dei tuoi personaggi, uno chiamato Topolino e uno chiamato Minni.)",
      },
      {
        title: "Pensando a Te",
        description:
          "Se questo personaggio verrebbe esiliato, aggiungilo invece al tuo calamaio, a faccia in giù e impegnato.",
      },
    ],
  },
  es: {
    name: "Mickey Mouse y Minnie Mouse",
    version: "Dúo aventurero",
    text: [
      {
        title:
          "<Duo Shift> 0 {I} (Puedes pagar 0 {I} para jugar esto encima de dos de tus personajes, uno llamado Mickey Mouse y otro llamado Minnie Mouse).",
      },
      {
        title: "Pensando en ti",
        description:
          "Si este personaje fuera a ser desterrado, colócalo en tu tintero boca abajo y ejercítalo en su lugar.",
      },
    ],
  },
};
