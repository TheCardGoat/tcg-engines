import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const makeThePotionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Make the Potion",
    text: [
      {
        title: "Choose one:",
      },
      {
        title: "• Banish chosen item.",
      },
      {
        title: "• Deal 2 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Den Trank brauen",
    text: [
      {
        title: "Wähle eine Möglickeit aus:",
      },
      {
        title: "• Verbanne einen Gegenstand deiner Wahl.",
      },
      {
        title: "• Füge einem beschädigten Charakter deiner Wahl 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Concocter la Potion",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Choisissez un objet et bannissez-le.",
      },
      {
        title:
          "• Choisissez un personnage ayant au moins un jeton Dommage et infligez-lui 2 dommages.",
      },
    ],
  },
  it: {
    name: "Fare la Pozione",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Esilia un oggetto a tua scelta.",
      },
      {
        title: "• Infliggi 2 danni a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
  es: {
    name: "Hacer la poción",
    text: [
      {
        title: "Elige uno:",
      },
      {
        title: "• Desterrar el objeto elegido.",
      },
      {
        title: "• Causa 2 daños al personaje dañado elegido.",
      },
    ],
  },
};
