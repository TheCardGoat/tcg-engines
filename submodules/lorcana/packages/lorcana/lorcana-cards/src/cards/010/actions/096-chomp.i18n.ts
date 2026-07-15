import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chompI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chomp!",
    text: "Deal 2 damage to chosen damaged character.",
  },
  de: {
    name: "Mampfen!",
    text: "Füge einem beschädigten Charakter deiner Wahl 2 Schaden zu.",
  },
  fr: {
    name: "Croque !",
    text: "Choisissez un personnage ayant au moins un dommage et infligez-lui 2 dommages.",
  },
  it: {
    name: "Gnam!",
    text: "Infliggi 2 danni a un personaggio danneggiato a tua scelta.",
  },
};
