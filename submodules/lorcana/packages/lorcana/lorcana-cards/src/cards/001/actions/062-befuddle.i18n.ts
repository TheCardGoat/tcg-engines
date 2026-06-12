import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const befuddleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Befuddle",
    text: "Return a character or item with cost 2 or less to their player's hand.",
  },
  de: {
    name: "Das meistbeirrende Spiel",
    text: "Schicke einen Charakter oder Gegenstand, der 2 oder weniger kostet, auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "EMBERLIFICOTAGE",
    text: "Renvoyez un personnage ou un objet coûtant 2 ou moins dans la main de son propriétaire.",
  },
  it: {
    name: "Befuddle",
    text: "Return chosen character or item with cost 2 or less to their player's hand.",
  },
};
