import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iFindEmIFlattenEmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I Find ’Em, I Flatten ’Em",
    text: "Banish all items.",
  },
  de: {
    name: "Ja, ich trete es klein",
    text: "Verbanne alle Gegenstände.",
  },
  fr: {
    name: "Ils cassent en deux comme je veux",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Bannissez tous les objets.",
      },
    ],
  },
  it: {
    name: "Una Furia Vivente",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Esilia tutti gli oggetti.",
      },
    ],
  },
};
