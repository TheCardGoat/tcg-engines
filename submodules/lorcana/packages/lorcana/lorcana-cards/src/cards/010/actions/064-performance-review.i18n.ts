import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const performanceReviewI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Performance Review",
    text: "{E} chosen ready character of yours to draw cards equal to that character's {L}.",
  },
  de: {
    name: "Leistungsbewertung",
    text: "{E} einen deiner bereiten Charaktere, um so viele Karten zu ziehen, wie dieser {L} hat.",
  },
  fr: {
    name: "Bilan de performance",
    text: "Choisissez et {E} l'un de vos personnages redressés pour piocher autant de cartes que son {L}.",
  },
  it: {
    name: "Valutazione delle Prestazioni",
    text: "{E} un tuo personaggio preparato a tua scelta per pescare carte pari al {L} di quel personaggio.",
  },
  es: {
    name: "Revisión de desempeño",
    text: "{E} elige tu personaje listo para robar cartas iguales a {L} de ese personaje.",
  },
};
