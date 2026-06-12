import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hotPotatoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hot Potato",
    text: "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.",
  },
  de: {
    name: "Heiss und Fettig",
    text: "Wähle eine Möglichkeit aus: • Füge einem Charakter deiner Wahl 2 Schaden zu. • Verbanne einen Gegenstand deiner Wahl.",
  },
  fr: {
    name: "Patate chaude",
    text: "Choisissez entre: • Choisissez un personnage et infligez-lui 2 dommages. • Choisissez un objet et bannissez-le.",
  },
  it: {
    name: "Patata Bollente",
    text: "Scegli uno: • Infliggi 2 danni a un personaggio a tua scelta. • Esilia un oggetto a tua scelta.",
  },
};
