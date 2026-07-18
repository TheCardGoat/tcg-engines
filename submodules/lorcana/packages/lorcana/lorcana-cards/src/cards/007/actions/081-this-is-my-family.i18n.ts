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
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Gagnez 1 éclat de Lore. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "I Mitici Madrigal",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ottieni 1 leggenda. Pesca una carta.",
      },
    ],
  },
  es: {
    name: "Esta es mi familia",
    text: "Gana 1 conocimiento. Saca una carta.",
  },
};
