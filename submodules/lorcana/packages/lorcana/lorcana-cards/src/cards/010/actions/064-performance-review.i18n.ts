import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const performanceReviewI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Performance Review",
    text: "{E} chosen ready character of yours to draw cards equal to that character's {L}.",
  },
  de: {
    name: "Leistungsbewertung",
    text: "einen deiner bereiten Charaktere, um so viele Karten zu ziehen, wie dieser hat.",
  },
  fr: {
    name: "Bilan de performance",
    text: "Choisissez et l'un de vos personnages redressés pour piocher autant de cartes que son.",
  },
  it: {
    name: "Valutazione delle Prestazioni",
    text: "un tuo personaggio preparato a tua scelta per pescare carte pari al di quel personaggio.",
  },
};
