import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const itsGonnaBeGreatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "It's Gonna Be Great!",
    text: "Ready chosen character. They can't quest for the rest of this turn.",
  },
  de: {
    name: "Das wird ein Spaß!",
    text: "Mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
  },
  fr: {
    name: "Ce sera génial !",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Se Vieni Con Me!",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
