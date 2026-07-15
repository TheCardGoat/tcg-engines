import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const akoodEtEmutiI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Akood et Emuti",
    text: "You pay 2 {I} less for the next character you play this turn. Draw a card.",
  },
  de: {
    name: "Akood et Emuti",
    text: "Du zahlst 2 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst. Ziehe 1 Karte.",
  },
  fr: {
    name: "Akood et Emuti",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Le prochain personnage que vous jouez ce tour-ci vous coûte 2 {I} de moins. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Akood et Emuti",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Paga 2 {I} in meno per giocare il tuo prossimo personaggio per questo turno. Pesca una carta.",
      },
    ],
  },
};
