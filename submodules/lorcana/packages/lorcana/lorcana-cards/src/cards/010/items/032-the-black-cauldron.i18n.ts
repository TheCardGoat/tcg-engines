import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theBlackCauldronI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Black Cauldron",
    text: [
      {
        title: "THE CAULDRON CALLS",
        description: "{E}, 1 {I} — Put a character card from your discard under this item faceup.",
      },
      {
        title: "RISE AND JOIN ME!",
        description: "{E}, 1 {I} — This turn, you may play characters from under this item.",
      },
    ],
  },
  de: {
    name: "Der schwarze Zauberkessel",
    text: [
      {
        title: "Der Kessel ruft",
        description:
          "{E}, 1 {I} — Lege 1 Charakterkarte aus deinem Ablagestapel offen unter diesen Gegenstand.",
      },
      {
        title: "Steht auf und folgt mir!",
        description:
          "{E}, 1 {I} — Du darfst in diesem Zug Charaktere ausspielen, die unter diesem Gegenstand liegen.",
      },
    ],
  },
  fr: {
    name: "Le Chaudron magique",
    text: [
      {
        title: "L'Appel du chaudron",
        description:
          "{E}, 1 {I} — Placez une carte Personnage de votre défausse sous cet objet, face visible.",
      },
      {
        title: "Levez-vous et joignez-vous à moi!",
        description:
          "{E}, 1 {I} — Pour le reste de ce tour, vous pouvez jouer les personnages placés sous cet objet.",
      },
    ],
  },
  it: {
    name: "La Pentola Magica",
    text: [
      {
        title: "Il Richiamo della Pentola",
        description:
          "{E}, 1 {I} — Metti una carta personaggio dai tuoi scarti sotto a questo oggetto, a faccia in su.",
      },
      {
        title: "Alzatevi e Unitevi a Me!",
        description:
          "{E}, 1 {I} — Per questo turno, puoi giocare i personaggi da sotto questo oggetto.",
      },
    ],
  },
};
