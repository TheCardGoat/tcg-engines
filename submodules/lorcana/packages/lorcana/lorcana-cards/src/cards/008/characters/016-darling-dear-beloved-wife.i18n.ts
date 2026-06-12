import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darlingDearBelovedWifeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darling Dear",
    version: "Beloved Wife",
    text: [
      {
        title: "HOW SWEET",
        description: "When you play this character, chosen character gets +2 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Darling",
    version: "Geliebte Ehefrau",
    text: [
      {
        title: "WIE SÜSS",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Darling",
    version: "Épouse bien-aimée",
    text: [
      {
        title: "COMME C'EST MIGNON",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tesoro Caro",
    version: "Moglie Adorata",
    text: [
      {
        title: "CHE AMORE",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +2 per questo turno.",
      },
    ],
  },
};
