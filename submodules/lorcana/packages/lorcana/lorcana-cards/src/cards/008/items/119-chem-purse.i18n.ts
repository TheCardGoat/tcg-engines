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
        title: "JETZT KOMMT DAS BESTE",
        description:
          "Jedes Mal, wenn du mithilfe von Gestaltwandel eine Flutgestalt ausspielst, erhält jene in diesem Zug +4.",
      },
    ],
  },
  fr: {
    name: "Nano-sac",
    text: [
      {
        title: "ET T'AS ENCORE RIEN VU",
        description:
          "Chaque fois que vous jouez un personnage en utilisant sa capacité Alter, il gagne +4 pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Borsetta Chimica",
    text: [
      {
        title: "ORA ARRIVA IL MEGLIO",
        description:
          "Ogni volta che giochi un personaggio, se hai usato Trasformazione per giocarlo, riceve +4 per questo turno.",
      },
    ],
  },
};
