import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHorsemanStrikesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Horseman Strikes!",
    text: "Draw a card. You may banish chosen character with Evasive.",
  },
  de: {
    name: "Der Reiter schlägt zu!",
    text: "Ziehe 1 Karte. Du darfst einen Charakter deiner Wahl mit Wendig verbannen.",
  },
  fr: {
    name: "Le Cavalier attaque !",
    text: "Piochez une carte. Vous pouvez choisir un personnage avec Insaisissable et le bannir.",
  },
  it: {
    name: "Il Cavaliere Colpisce!",
    text: "Pesca una carta. Puoi esiliare un personaggio a tua scelta con Sfuggente.",
  },
};
