import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const retrosphereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Retrosphere",
    text: [
      {
        title: "EXTRACT OF AMETHYST 2",
        description:
          "{I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Retrosphäre",
    text: [
      {
        title: "Extrakt aus Amethyst",
        description:
          "2 {I}, Verbanne diesen Gegenstand — Schicke einen Charakter, Gegenstand oder Ort deiner Wahl, der 3 oder weniger kostet, auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Rétrosphère",
    text: [
      {
        title: "Extrait d'améthyste",
        description:
          "2 {I}, bannissez cet objet — Choisissez un personnage, un objet ou un lieu ayant un coût de 3 ou moins et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Retrosfera",
    text: [
      {
        title: "Estratto di Ametista",
        description:
          "2 {I}, esilia questo oggetto — Fai riprendere in mano al suo giocatore un personaggio, un oggetto o un luogo a tua scelta con costo 3 o inferiore.",
      },
    ],
  },
};
