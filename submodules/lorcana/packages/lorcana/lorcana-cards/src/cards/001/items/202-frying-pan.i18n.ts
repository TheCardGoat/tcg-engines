import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fryingPanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Frying Pan",
    text: [
      {
        title: "CLANG!",
        description: "Banish this item — Chosen character can't challenge during their next turn.",
      },
    ],
  },
  de: {
    name: "Bratpfanne",
    text: [
      {
        title: "KLONG!",
        description:
          "Verbanne diesen Gegenstand — wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "POÊLE À FRIRE",
    text: [
      {
        title: "BANG!",
        description:
          "Bannissez cet objet — Choisissez un personnage qui ne pourra pas défier durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Frying Pan",
    text: [
      {
        title: "CLANG!",
        description: "Banish this item — Chosen character can't challenge during their next turn.",
      },
    ],
  },
};
