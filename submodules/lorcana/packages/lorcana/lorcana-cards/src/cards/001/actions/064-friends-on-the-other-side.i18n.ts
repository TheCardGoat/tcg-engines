import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const friendsOnTheOtherSideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Friends on the Other Side",
    text: "Draw 2 cards.",
  },
  de: {
    name: "Freunde im Schattenreich",
    text: "Ziehe 2 Karten.",
  },
  fr: {
    name: "MES AMIS DE L'AU-DELÀ",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "Gli Amici nell'Aldilà",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Pesca 2 carte.",
      },
    ],
  },
};
