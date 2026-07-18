import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicMirrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Mirror",
    text: [
      {
        title: "SPEAK!",
        description: "{E}, 4 {I} — Draw a card.",
      },
    ],
  },
  de: {
    name: "Wunderspiegel",
    text: [
      {
        title: "Sprich!",
        description: "{E}, 4 {I} — Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "MIROIR MAGIQUE",
    text: [
      {
        title: "PARLE!",
        description: "{E}, 4 {I} — Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Magic Mirror",
    text: [
      {
        title: "Speak!",
        description: "{E}, 4 {I} — Draw a card.",
      },
    ],
  },
  es: {
    name: "Espejo magico",
    text: [
      {
        title: "¡HABLAR!",
        description: "{E}, 4 {I} — Roba una carta.",
      },
    ],
  },
};
