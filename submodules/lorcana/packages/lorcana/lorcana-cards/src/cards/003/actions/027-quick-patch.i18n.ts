import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const quickPatchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Quick Patch",
    text: "Remove up to 3 damage from chosen location.",
  },
  de: {
    name: "Provisorischer Flicken",
    text: "Entferne bis zu 3 Schaden von einem Ort deiner Wahl.",
  },
  fr: {
    name: "Réparation de fortune",
    text: "Choisissez un lieu et retirez-lui jusqu'à 3 jetons Dommage.",
  },
  it: {
    name: "Riparazione Rapida",
    text: "Rimuovi fino a 3 danni da un luogo a tua scelta.",
  },
};
