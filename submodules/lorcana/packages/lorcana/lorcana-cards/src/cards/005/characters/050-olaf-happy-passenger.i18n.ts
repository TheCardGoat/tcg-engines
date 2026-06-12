import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafHappyPassengerI18n: Record<Languages, I18nProperties> = {
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
        title: "DEN WEG FREI RÄUMEN",
        description:
          "Für jeden gegnerischen erschöpften Charakter im Spiel, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Wendig",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Passager heureux",
    text: [
      {
        title: "DÉGAGER LE CHEMIN",
        description: "Jouer ce personnage vous coûte 1 de moins par personnage adverse épuisé.",
      },
      {
        title: "Insaisissable",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Passeggero Felice",
    text: [
      {
        title: "SPIANARE LA STRADA",
        description:
          "Per ogni personaggio impegnato che gli avversari hanno in gioco, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Sfuggente",
      },
    ],
  },
};
