import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverFerociousFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Ferocious Friend",
    text: [
      {
        title: "YOU HAVE TO CHART YOUR OWN COURSE",
        description:
          "Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Gefährlicher Freund",
    text: [
      {
        title: "DU MUSST DEINEN KURS SELBER BESTIMMEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem deiner anderen Charaktere 1 Schaden zufügen. Wenn du dies tust, mache den Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Ami féroce",
    text: [
      {
        title: "CHOISIS TON PROPRE CAP",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un autre de vos personnages. Infligez-lui 1 dommage et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Amico Feroce",
    text: [
      {
        title: "TRACCIARE LA TUA ROTTA",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi infliggere 1 danno a un tuo altro personaggio a tua scelta. Se lo fai, prepara quel personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
