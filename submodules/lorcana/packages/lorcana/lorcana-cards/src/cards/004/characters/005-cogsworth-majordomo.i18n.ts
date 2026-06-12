import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthMajordomoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Majordomo",
    text: [
      {
        title: "AS YOU WERE!",
        description:
          "Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Haushofmeister",
    text: [
      {
        title: "WIE DU WARST!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 geben.",
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Majordome",
    text: [
      {
        title: "ROMPEZ!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage qui subit -2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Tockins",
    version: "Maggior-domo",
    text: [
      {
        title: "RIPOSO!",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi dare -2 a un personaggio a tua scelta fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
