import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const quickShotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Quick Shot",
    text: "Deal 1 damage to chosen character. Draw a card.",
  },
  de: {
    name: "Schneller Schuss",
    text: "Füge einem Charakter deiner Wahl 1 Schaden zu. Ziehe 1 Karte.",
  },
  fr: {
    name: "Tir rapide",
    text: "Choisissez un personnage et infligez-lui 1 dommage. Piochez une carte.",
  },
  it: {
    name: "Colpo Rapido",
    text: "Infliggi 1 danno a un personaggio a tua scelta. Pesca una carta.",
  },
};
