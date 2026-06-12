import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const someoneWillLoseHisHeadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Someone Will Lose His Head",
    text: "Each opposing character gets -2 {S} this turn.",
  },
  de: {
    name: "Ich schlag' euch alle tot",
    text: "Gib allen gegnerischen Charakteren in diesem Zug -2 {S}.",
  },
  fr: {
    name: "On leur coupera la tête",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Chaque personnage adverse subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Qualcuno La Testa Perderà",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ogni personaggio avversario riceve -2 {S} per questo turno.",
      },
    ],
  },
};
