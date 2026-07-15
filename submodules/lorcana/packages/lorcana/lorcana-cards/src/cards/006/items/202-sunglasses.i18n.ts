import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sunglassesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sunglasses",
    text: [
      {
        title: "SPYCRAFT",
        description: "{E} — Draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Sonnenbrille",
    text: [
      {
        title: "Spionagetechnik",
        description: "{E} — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Lunettes de soleil",
    text: [
      {
        title: "Espionnage",
        description: "{E} — Piochez une carte, puis défaussez une carte.",
      },
    ],
  },
  it: {
    name: "Occhiali da Sole",
    text: [
      {
        title: "Gadget da Spionaggio",
        description: "{E} — Pesca una carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
