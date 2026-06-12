import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSorcerersSpellbookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sorcerer's Spellbook",
    text: [
      {
        title: "KNOWLEDGE",
        description: "{E}, 1 {I} — Gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Das Buch der Zaubersprüche",
    text: [
      {
        title: "WISSEN, 1",
        description: "— Sammle 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Grimoire du sorcier",
    text: [
      {
        title: "CONNAISSANCE, 1",
        description: "— Gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "The Sorcerer's Spellbook",
    text: [
      {
        title: "KNOWLEDGE, 1",
        description: "— Gain 1 lore.",
      },
    ],
  },
};
