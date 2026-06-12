import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const swingIntoActionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Swing into Action",
    text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  },
  de: {
    name: "Mit Schwung in die Aktion",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
  },
  fr: {
    name: "Passer à l'action",
    text: "Choisissez un personnage qui gagne Charge pour le reste de ce tour.",
  },
  it: {
    name: "Lanciarsi in Azione",
    text: "Un personaggio a tua scelta ottiene Lesto per questo turno. (Può sfidare nel turno in cui viene giocato.)",
  },
};
