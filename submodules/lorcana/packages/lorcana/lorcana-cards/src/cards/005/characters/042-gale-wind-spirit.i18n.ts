import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const galeWindSpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gale",
    version: "Wind Spirit",
    text: [
      {
        title: "RECURRING GUST",
        description:
          "When this character is banished in a challenge, return this card to your hand.",
      },
    ],
  },
  de: {
    name: "Gale",
    version: "Element des Windes",
    text: [
      {
        title: "Wiederkehrende Böe",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Courant d’Air",
    version: "Esprit du vent",
    text: [
      {
        title: "Bourrasques persistantes",
        description: "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main.",
      },
    ],
  },
  it: {
    name: "Zefiro",
    version: "Spirito del Vento",
    text: [
      {
        title: "Brezza Ricorrente",
        description:
          "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
    ],
  },
  es: {
    name: "Vendaval",
    version: "Espíritu del viento",
    text: [
      {
        title: "RAFAGA RECURRENTE",
        description:
          "Cuando este personaje sea desterrado en un desafío, devuelve esta carta a tu mano.",
      },
    ],
  },
};
