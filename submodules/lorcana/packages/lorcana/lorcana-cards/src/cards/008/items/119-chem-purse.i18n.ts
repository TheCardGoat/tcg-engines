import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chemPurseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chem Purse",
    text: [
      {
        title: "HERE'S THE BEST PART",
        description:
          "Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Chemie-Tasche",
    text: [
      {
        title: "Jetzt kommt das Beste",
        description:
          "Jedes Mal, wenn du mithilfe von <Gestaltwandel> eine Flutgestalt ausspielst, erhält jene in diesem Zug +4 {S}.",
      },
    ],
  },
  fr: {
    name: "Nano-sac",
    text: [
      {
        title: "Et t'as encore rien vu",
        description:
          "Chaque fois que vous jouez un personnage en utilisant sa capacité <Alter>, il gagne +4 {S} pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Borsetta Chimica",
    text: [
      {
        title: "Ora Arriva il Meglio",
        description:
          "Ogni volta che giochi un personaggio, se hai usato <Trasformazione> per giocarlo, riceve +4 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Monedero químico",
    text: [
      {
        title: "AQUÍ ESTÁ LA MEJOR PARTE",
        description:
          "Siempre que juegas con un personaje, si usaste Shift para jugarlo, obtiene +4 {S} este turno.",
      },
    ],
  },
};
