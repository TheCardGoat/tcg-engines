import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowballFightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snowball Fight",
    text: "Each opponent chooses and discards a card. If you have a character with Evasive in play, gain 1 lore.",
  },
  de: {
    name: "Schneeballschlacht",
    text: "Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab. Wenn du mindestens einen Charakter mit Wendig im Spiel hast, sammelst du 1 Legende.",
  },
  fr: {
    name: "Bataille de boules de neige",
    text: "Chaque adversaire défausse une carte. Si vous avez un personnage avec Insaisissable en jeu, gagnez 1 éclat de Lore.",
  },
  it: {
    name: "Battaglia di Palle di Neve",
    text: "Ogni avversario sceglie e scarta una carta. Se hai in gioco un personaggio con Sfuggente, ottieni 1 leggenda.",
  },
};
