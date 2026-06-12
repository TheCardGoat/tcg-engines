import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goldenHarpEnchanterOfTheLandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Golden Harp",
    version: "Enchanter of the Land",
    text: [
      {
        title: "STOLEN AWAY",
        description:
          "At the end of your turn, if you didn't play a song this turn, banish this character.",
      },
    ],
  },
  de: {
    name: "Goldene Harfe",
    version: "Landverzauberin",
    text: [
      {
        title: "GESTOHLEN",
        description:
          "Am Ende deines Zuges, verbanne diesen Charakter, falls du in diesem Zug kein Lied ausgespielt hast.",
      },
    ],
  },
  fr: {
    name: "La Harpe Magique",
    version: "Enchanteresse de la Vallée",
    text: [
      {
        title: "VOLÉE À",
        description:
          "la fin de votre tour, si vous n'avez pas joué de chanson durant ce tour, bannissez ce personnage.",
      },
    ],
  },
  it: {
    name: "Arpa Magica",
    version: "Ammaliatrice della Valle",
    text: [
      {
        title: "RAPITA",
        description:
          "Alla fine del tuo turno, esilia questo personaggio se non hai giocato una canzone in questo turno.",
      },
    ],
  },
};
