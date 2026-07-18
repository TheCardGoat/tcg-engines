import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fragileAsAFlowerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fragile as a Flower",
    text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
  },
  de: {
    name: "Zart wie eine Blume",
    text: "Ziehe 1 Karte. Erschöpfe einen Charakter deiner Wahl, der 2 oder weniger kostet. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
  },
  fr: {
    name: "Aussi fragile qu’une fleur",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Piochez une carte. Choisissez un personnage coûtant 2 ou moins et épuisez-le. Il ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Un Fuscello Delicato",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Pesca una carta. Impegna un personaggio a tua scelta con costo 2 o inferiore. Non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Frágil como una flor",
    text: "Saca una carta. Ejerce el personaje elegido con coste 2 o menos. No pueden prepararse al comienzo de su siguiente turno.",
  },
};
