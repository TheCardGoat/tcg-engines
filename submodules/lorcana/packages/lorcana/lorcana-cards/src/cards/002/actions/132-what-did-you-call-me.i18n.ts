import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whatDidYouCallMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "What Did You Call Me?",
    text: "Chosen damaged character gets +3 {S} this turn.",
  },
  de: {
    name: "Wie hast du mich genannt?",
    text: "Gib einem beschädigten Charakter deiner Wahl in diesem Zug +3.",
  },
  fr: {
    name: "Comment m'as-tu nommé ?",
    text: "Choisissez un personnage blessé, il gagne +3 pour le reste de ce tour.",
  },
  it: {
    name: "What Did You Call Me?",
    text: "Chosen damaged character gets +3 this turn.",
  },
};
