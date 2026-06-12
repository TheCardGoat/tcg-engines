import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const galacticCommunicatorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Galactic Communicator",
    text: [
      {
        title: "RESOURCE ALLOCATION 1",
        description:
          "{I}, Banish this item — Return chosen character with 2 {S} or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Galaktischer Kommunikator",
    text: [
      {
        title: "RESSOURCENZUTEILUNG 1,",
        description:
          "Verbanne diesen Gegenstand — Schicke einen Charakter deiner Wahl mit 2 oder weniger auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Communicateur galactique",
    text: [
      {
        title: "ALLOCATION DES RESSOURCES 1,",
        description:
          "bannissez cet objet — Renvoyez dans la main de son propriétaire un personnage avec une de 2 ou moins.",
      },
    ],
  },
  it: {
    name: "Comunicatore Galattico",
    text: [
      {
        title: "INVIO DI RISORSE 1,",
        description:
          "esilia questo oggetto — Fai riprendere in mano al suo giocatore un personaggio a tua scelta con 2 o inferiore.",
      },
    ],
  },
};
