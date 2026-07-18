import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoCleverCluefinderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Clever Cluefinder",
    text: [
      {
        title: "ON THE TRAIL",
        description:
          "{E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Schlauer Spurensucher",
    text: [
      {
        title: "Auf der Spur",
        description:
          "{E} — Falls du mindestens einen Detektiv im Spiel hast, nimm 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand. Falls nicht, lege sie auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Fin dénicheur d'indices",
    text: [
      {
        title: "Sur la piste",
        description:
          "{E} — Si vous avez un personnage Détective en jeu, renvoyez dans votre main une carte Objet de votre défausse. Sinon, placez-la sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Brillante Fiutaindizi",
    text: [
      {
        title: "Sulla Pista",
        description:
          "{E} — Se hai in gioco un personaggio Detective, riprendi in mano una carta oggetto dai tuoi scarti. Altrimenti, mettila in cima al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Plutón",
    version: "Buscador de pistas inteligente",
    text: [
      {
        title: "EN EL CAMINO",
        description:
          "{E}: si tienes un personaje de detective en juego, devuelve a tu mano una carta de objeto de tu descarte. De lo contrario, colóquelo en la parte superior de su plataforma.",
      },
    ],
  },
};
