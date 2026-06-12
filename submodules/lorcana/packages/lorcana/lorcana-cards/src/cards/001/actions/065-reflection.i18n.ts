import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const reflectionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Reflection",
    text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  },
  de: {
    name: "Wer bin ich?",
    text: "Schaue dir die obersten 3 Karten deines Decks an. Lege sie in beliebiger Reihenfolge zurück auf dein Deck.",
  },
  fr: {
    name: "Réflexion",
    text: "Regardez les 3 premières cartes de votre pioche. Remettez-les sur le dessus de votre pioche, dans l'ordre de votre choix.",
  },
  it: {
    name: "Riflesso",
    text: "(Un personaggio con costo 1 o superiore può per cantare questa canzone gratis.) Guarda le prime 3 carte del tuo mazzo. Rimettile in cima al tuo mazzo in qualsiasi ordine.",
  },
};
