import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ramaVigilantFatherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rama",
    version: "Vigilant Father",
    text: [
      {
        title: "PROTECTION OF THE PACK",
        description:
          "Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Rama",
    version: "Wachsamer Vater",
    text: [
      {
        title: "SCHUTZ DES RUDELS",
        description:
          "Jedes Mal, wenn du einen anderen Charakter mit 5 oder mehr ausspielst, darfst du diesen Charakter bereit machen. Wenn du dies tust, kann er in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Rama",
    version: "Père vigilant",
    text: [
      {
        title: "LA PROTECTION DE NOTRE CLAN",
        description:
          "Chaque fois que vous jouez un autre personnage ayant 5 ou plus, vous pouvez redresser ce personnage-ci. Si vous le faites, ce personnage-ci ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Rama",
    version: "Padre Vigile",
    text: [
      {
        title: "PROTEZIONE DEL BRANCO",
        description:
          "Ogni volta che giochi un altro personaggio con 5 o superiore, puoi preparare questo personaggio. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
