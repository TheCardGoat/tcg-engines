import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theLampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Lamp",
    text: [
      {
        title: "GOOD OR EVIL",
        description:
          "Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Die Lampe",
    text: [
      {
        title: "Gut oder Böse",
        description:
          "Verbanne diesen Gegenstand — Wenn du einen Dschafar-Charakter im Spiel hast, ziehe 2 Karten. Wenn du einen Dschinni-Charakter im Spiel hast, schicke einen Charakter deiner Wahl, der 4 oder weniger kostet, auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "La lampe",
    text: [
      {
        title: "Bien ou Mal",
        description:
          "Bannissez cet objet — Si vous avez un personnage Jafar en jeu, piochez 2 cartes. Si vous avez un personnage Génie en jeu, choisissez un personnage coûtant 4 ou moins et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "La Lampada",
    text: [
      {
        title: "Bene o Male",
        description:
          "Esilia questo oggetto — Se hai un personaggio chiamato Jafar in gioco, pesca 2 carte. Se hai un personaggio chiamato Genio in gioco, fai riprendere un personaggio a tua scelta con costo 4 o inferiore in mano al suo giocatore.",
      },
    ],
  },
  es: {
    name: "La lámpara",
    text: [
      {
        title: "BIEN O MAL",
        description:
          "Desterrar este objeto: si tienes un personaje llamado Jafar en juego, roba 2 cartas. Si tienes un personaje llamado Genio en juego, devuelve el personaje elegido con un coste de 4 o menos a la mano de su jugador.",
      },
    ],
  },
};
