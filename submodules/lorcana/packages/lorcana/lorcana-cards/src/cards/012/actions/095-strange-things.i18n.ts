import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const strangeThingsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Strange Things",
    text: "Up to 2 chosen characters can't quest until the start of your next turn. Draw a card.",
  },
  de: {
    name: "Sehr seltsame Dinge",
    text: "Bis zu 2 gegnerische Charaktere deiner Wahl können bis zu Beginn deines nächsten Zuges nicht erkunden. Ziehe 1 Karte.",
  },
  fr: {
    name: "Étrange Bazar",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez jusqu'à 2 personnages qui ne peuvent pas être envoyés à l'aventure jusqu'au début de votre prochain tour. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Che Strane Cose",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Fino a 2 personaggi a tua scelta non possono andare all'avventura fino all'inizio del tuo prossimo turno. Pesca una carta.",
      },
    ],
  },
};
