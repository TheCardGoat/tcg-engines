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
    text: "Wähle eine Möglickeit aus: • Verbanne einen Gegenstand deiner Wahl. • Füge einem beschädigten Charakter deiner Wahl 2 Schaden zu.",
  },
  fr: {
    name: "Concocter la Potion",
    text: "Choisissez entre: • Choisissez un objet et bannissez-le. • Choisissez un personnage ayant au moins un jeton Dommage et infligez-lui 2 dommages.",
  },
  it: {
    name: "Fare la Pozione",
    text: "Scegli uno: • Esilia un oggetto a tua scelta. • Infliggi 2 danni a un personaggio danneggiato a tua scelta.",
  },
};
