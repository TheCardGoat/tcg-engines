import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hypnotizeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hypnotize",
    text: "Each opponent chooses and discards a card. Draw a card.",
  },
  de: {
    name: "Hypnose",
    text: "Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen diese ab. Ziehe 1 Karte.",
  },
  fr: {
    name: "Hypnotiser",
    text: "Chaque adversaire choisit une carte et la défausse. Piochez une carte.",
  },
  it: {
    name: "Ipnotizzare",
    text: "Ogni avversario sceglie e scarta una carta. Pesca una carta.",
  },
};
