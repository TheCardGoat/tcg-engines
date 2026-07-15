import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const forceOfAGreatTyphoonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Force of a Great Typhoon",
    text: "Chosen character gets +5 {S} this turn.",
  },
  de: {
    name: "Stark wie ein Taifun",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug +5 {S}.",
  },
  fr: {
    name: "Plus puissant que les ouragans",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage qui gagne +5 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Un Uomo Vero Senza Timori",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Un personaggio a tua scelta riceve +5 {S} per questo turno.",
      },
    ],
  },
};
