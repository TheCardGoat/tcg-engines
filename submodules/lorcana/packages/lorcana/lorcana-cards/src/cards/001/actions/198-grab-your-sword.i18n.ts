import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grabYourSwordI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grab Your Sword",
    text: "Deal 2 damage to each opposing character.",
  },
  de: {
    name: "Nehmt das Schwert",
    text: "Füge jedem gegnerischen Charakter 2 Schaden zu.",
  },
  fr: {
    name: "TUONS LA BÊTE !",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Infligez 2 dommages à chaque personnage adverse.",
      },
    ],
  },
  it: {
    name: "Grab Your Sword",
    text: "Deal 2 damage to each opposing character.",
  },
  es: {
    name: "Coge tu espada",
    text: "Inflige 2 daños a cada personaje contrario.",
  },
};
