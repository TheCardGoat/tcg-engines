import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thisIsMyFamilyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "This Is My Family",
    text: "Gain 1 lore. Draw a card.",
  },
  de: {
    name: "Meine Familie",
    text: "Sammle 1 Legende. Ziehe 1 Karte.",
  },
  fr: {
    name: "C'est ma famille",
    text: "Gagnez 1 éclat de Lore. Piochez une carte.",
  },
  it: {
    name: "I Mitici Madrigal",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Ottieni 1 leggenda. Pesca una carta.",
  },
};
