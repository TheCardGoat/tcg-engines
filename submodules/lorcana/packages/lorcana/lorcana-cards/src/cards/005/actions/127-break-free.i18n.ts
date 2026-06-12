import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const breakFreeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Break Free",
    text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)",
  },
  de: {
    name: "Befreien",
    text: "Wähle einen deiner Charaktere und füge ihm 1 Schaden zu. Er erhält in diesem Zug +1 und Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
  },
  fr: {
    name: "Se libérer",
    text: "Choisissez l'un de vos personnages et infligez-lui 1 dommage. Il gagne Charge et +1 pour le reste de ce tour.",
  },
  it: {
    name: "Liberarsi",
    text: "Infliggi 1 danno a un tuo personaggio a tua scelta. Ottiene Lesto e riceve +1 per questo turno. (Può sfidare nel turno in cui viene giocato.)",
  },
};
