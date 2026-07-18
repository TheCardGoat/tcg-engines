import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const toWitherAFlowerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "To Wither a Flower",
    text: "Deal 2 damage to each opposing damaged character.",
  },
  de: {
    name: "Die Blume verdorrt",
    text: "Füge jedem gegnerischen beschädigten Charakter 2 Schaden zu.",
  },
  fr: {
    name: "Je dessèche une fleur",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Infligez 2 dommages à chaque personnage adverse ayant au moins un dommage.",
      },
    ],
  },
  it: {
    name: "Si Spampana e Muor",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Infliggi 2 danni a ogni personaggio avversario danneggiato.",
      },
    ],
  },
  es: {
    name: "Marchitar una flor",
    text: "Inflige 2 daños a cada personaje dañado del oponente.",
  },
};
