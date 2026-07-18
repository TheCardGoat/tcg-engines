import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pullTheLeverP2ChallengeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pull the Lever!",
    text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  },
  de: {
    name: "Zieh den Hebel!",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Ziehe 2 Karten.",
      },
      {
        title:
          "• Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Abaisse le levier !",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Piochez 2 cartes.",
      },
      {
        title: "• Chaque adversaire défausse une carte.",
      },
    ],
  },
  it: {
    name: "Abbassa la Leva!",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Pesca 2 carte.",
      },
      {
        title: "• Ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
  es: {
    name: "¡Tira de la palanca!",
    text: "Elige uno:\n- Roba 2 cartas.\n- Cada oponente elige y descarta una carta.",
  },
};
