import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const strengthOfARagingFireI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Strength of a Raging Fire",
    text: "Deal damage to chosen character equal to the number of characters you have in play.",
  },
  de: {
    name: "Herz aus Stahl",
    text: "Zähle deine Charaktere im Spiel. Füge einem Charakter deiner Wahl dieselbe Anzahl Schaden zu.",
  },
  fr: {
    name: "Plus ardent que le feu des volcans",
    text: "Choisissez un personnage et infligez-lui autant de dommages que de personnages que vous avez en jeu.",
  },
  it: {
    name: "Potente Come un Vulcano Attivo",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Infliggi danno a un personaggio a tua scelta pari al numero di personaggi che hai in gioco.",
  },
};
