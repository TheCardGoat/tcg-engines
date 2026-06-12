import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pullTheLeverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pull the Lever!",
    text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
    optionTexts: ["Draw 2 cards.", "Each opponent chooses and discards a card."],
  },
  de: {
    name: "Zieh den Hebel!",
    text: "Wähle eine Möglichkeit aus: • Ziehe 2 Karten. • Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
    optionTexts: [
      "Ziehe 2 Karten.",
      "Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
    ],
  },
  fr: {
    name: "Abaisse le levier !",
    text: "Choisissez entre: • Piochez 2 cartes. • Chaque adversaire défausse une carte.",
    optionTexts: ["Piochez 2 cartes.", "Chaque adversaire défausse une carte."],
  },
  it: {
    name: "Abbassa la Leva!",
    text: "Scegli uno: • Pesca 2 carte. • Ogni avversario sceglie e scarta una carta.",
    optionTexts: ["Pesca 2 carte.", "Ogni avversario sceglie e scarta una carta."],
  },
};
