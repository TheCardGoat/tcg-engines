import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stolenScimitarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stolen Scimitar",
    text: [
      {
        title: "SLASH",
        description:
          "{E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      },
    ],
  },
  de: {
    name: "Gestohlener Säbel",
    text: [
      {
        title: "Hieb",
        description:
          "{E} — Gib einem Charakter deiner Wahl in diesem Zug +1 {S}. Wählst du einen Aladdin-Charakter, dann gib ihm stattdessen +2 {S}.",
      },
    ],
  },
  fr: {
    name: "CIMETERRE VOLÉ",
    text: [
      {
        title: "SLASH!",
        description:
          "{E} — Choisissez un personnage, il gagne +1 {S} pour le reste de ce tour. S'il s'agit d'un personnage Aladdin, il gagne +2 {S} à la place.",
      },
    ],
  },
  it: {
    name: "Stolen Scimitar",
    text: [
      {
        title: "Slash",
        description:
          "{E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      },
    ],
  },
};
