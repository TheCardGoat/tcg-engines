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
        title: "Ressourcenzuteilung",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Schicke einen Charakter deiner Wahl mit 2 oder weniger {S} auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Communicateur galactique",
    text: [
      {
        title: "Allocation des ressources",
        description:
          "1 {I}, bannissez cet objet — Renvoyez dans la main de son propriétaire un personnage avec une {S} de 2 ou moins.",
      },
    ],
  },
  it: {
    name: "Comunicatore Galattico",
    text: [
      {
        title: "Invio di Risorse",
        description:
          "1 {I}, esilia questo oggetto — Fai riprendere in mano al suo giocatore un personaggio a tua scelta con 2 {S} o inferiore.",
      },
    ],
  },
  es: {
    name: "Comunicador Galáctico",
    text: [
      {
        title: "ASIGNACIÓN DE RECURSOS 1",
        description:
          "{I}, destierra este objeto: devuelve el personaje elegido con 2 {S} o menos a la mano de su jugador.",
      },
    ],
  },
};
