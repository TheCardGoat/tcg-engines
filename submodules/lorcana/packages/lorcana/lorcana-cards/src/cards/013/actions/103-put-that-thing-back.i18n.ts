import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const putThatThingBackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Put That Thing Back",
    text: "Return chosen character or item to their player's hand.",
  },
  de: {
    name: "Leg das Ding sofort zurück",
    text: "Schicke einen Charakter oder Gegenstand deiner Wahl auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Déblaie-nous ta Bouh du plancher",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un objet ou un personnage et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Riporta Quell'Affare Dove Stava",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Fai riprendere in mano al suo giocatore un personaggio o un oggetto a tua scelta.",
      },
    ],
  },
};
