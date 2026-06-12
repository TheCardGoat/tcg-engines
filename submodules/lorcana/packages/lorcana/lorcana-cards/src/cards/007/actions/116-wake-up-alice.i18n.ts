import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wakeUpAliceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wake Up, Alice!",
    text: "Return chosen damaged character to their player's hand.",
  },
  de: {
    name: "Alice, wach auf!",
    text: "Schicke einen beschädigten Charakter deiner Wahl auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Réveille-toi, Alice !",
    text: "Choisissez un personnage avec au moins un dommage et renvoyez-le dans la main de son propriétaire.",
  },
  it: {
    name: "Alice, Svegliati!",
    text: "Fai tornare in mano al suo giocatore un personaggio danneggiato a tua scelta.",
  },
};
