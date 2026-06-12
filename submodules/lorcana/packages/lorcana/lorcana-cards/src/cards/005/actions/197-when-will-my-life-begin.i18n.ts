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
    text: "Choisissez un personnage qui ne pourra pas défier lors de son prochain tour. Piochez une carte.",
  },
  it: {
    name: "Aspetto Quel che Succederà",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta non può sfidare durante il suo prossimo turno. Pesca una carta.",
  },
};
