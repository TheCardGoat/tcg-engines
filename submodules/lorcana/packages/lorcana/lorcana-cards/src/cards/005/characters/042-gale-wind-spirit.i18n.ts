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
        title: "WIEDERKEHRENDE BÖE",
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
        title: "BOURRASQUES PERSISTANTES",
        description: "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main.",
      },
    ],
  },
  it: {
    name: "Zefiro",
    version: "Spirito del Vento",
    text: [
      {
        title: "BREZZA RICORRENTE",
        description:
          "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
    ],
  },
};
