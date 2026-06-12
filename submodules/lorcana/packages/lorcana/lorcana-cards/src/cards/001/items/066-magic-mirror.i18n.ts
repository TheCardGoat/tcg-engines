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
        title: "SPRICH!, 4",
        description: "— Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "MIROIR MAGIQUE",
    text: [
      {
        title: "PARLE!, 4",
        description: "— Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Magic Mirror",
    text: [
      {
        title: "SPEAK!, 4",
        description: "— Draw a card.",
      },
    ],
  },
};
