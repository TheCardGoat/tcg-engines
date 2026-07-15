import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whenWillMyLifeBeginI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "When Will My Life Begin?",
    text: "Chosen character can't challenge during their next turn. Draw a card.",
  },
  de: {
    name: "Wann fängt mein Leben an?",
    text: "Wähle einen Charakter. Er kann in seinem nächsten Zug nicht herausfordern. Ziehe 1 Karte.",
  },
  fr: {
    name: "Où est la vraie vie ?",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui ne pourra pas défier lors de son prochain tour. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Aspetto Quel che Succederà",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta non può sfidare durante il suo prossimo turno. Pesca una carta.",
      },
    ],
  },
};
