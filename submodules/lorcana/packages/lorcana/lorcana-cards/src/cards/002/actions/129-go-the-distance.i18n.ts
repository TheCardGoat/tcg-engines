import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goTheDistanceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Go the Distance",
    text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  },
  de: {
    name: "Ich werd‘s noch beweisen",
    text: "Mache einen deiner beschädigten Charaktere bereit. Er kann in diesem Zug nicht mehr erkunden. Ziehe 1 Karte.",
  },
  fr: {
    name: "Le monde qui est le mien",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez l'un de vos personnages blessés et redressez-le. Celui-ci ne peut pas être envoyé à l'aventure pour le reste de ce tour. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Ce la Posso Fare",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Prepara un tuo personaggio danneggiato a tua scelta. Non può andare all'avventura per il resto di questo turno. Pesca una carta.",
      },
    ],
  },
};
