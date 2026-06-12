import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thieveryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Thievery",
    text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  },
  de: {
    name: "Diebstahl",
    text: "Eine gegnerische Person deiner Wahl verliert 1 Legende. Sammle 1 Legende.",
  },
  fr: {
    name: "Chapardage",
    text: "Choisissez un adversaire qui perd 1 éclat de Lore. Gagnez 1 éclat de Lore.",
  },
  it: {
    name: "Furto",
    text: "Un avversario a tua scelta perde 1 leggenda. Ottieni 1 leggenda.",
  },
};
