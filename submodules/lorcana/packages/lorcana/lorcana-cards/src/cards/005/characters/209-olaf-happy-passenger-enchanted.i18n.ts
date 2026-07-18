import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafHappyPassengerEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Happy Passenger",
    text: [
      {
        title: "CLEAR THE PATH",
        description:
          "For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "Evasive",
      },
    ],
  },
  de: {
    name: "Olaf",
    version: "Fröhlicher Passagier",
    text: [
      {
        title: "Den Weg frei räumen",
        description:
          "Für jeden gegnerischen erschöpften Charakter im Spiel, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "<Wendig>",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Passager heureux",
    text: [
      {
        title: "Dégager le chemin",
        description: "Jouer ce personnage vous coûte 1 {I} de moins par personnage adverse épuisé.",
      },
      {
        title: "<Insaisissable>",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Passeggero Felice",
    text: [
      {
        title: "Spianare la Strada",
        description:
          "Per ogni personaggio impegnato che gli avversari hanno in gioco, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Sfuggente>",
      },
    ],
  },
  es: {
    name: "Olaf",
    version: "Pasajero feliz",
    text: [
      {
        title: "LIMPIE EL CAMINO",
        description:
          "Por cada personaje ejercido que los oponentes tengan en juego, pagas 1 {I} menos para jugar con este personaje.",
      },
      {
        title: "Evasivo",
      },
    ],
  },
};
