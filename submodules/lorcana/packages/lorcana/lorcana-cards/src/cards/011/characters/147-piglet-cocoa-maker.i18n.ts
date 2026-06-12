import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pigletCocoaMakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Piglet",
    version: "Cocoa Maker",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "SPECIAL RECIPE",
        description: "At the end of your turn, remove up to 2 damage from each of your characters.",
      },
    ],
  },
  de: {
    name: "Ferkel",
    version: "Kakaomacher",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "SPEZIALREZEPT",
        description: "Am Ende deines Zuges, entferne bis zu 2 Schaden von jedem deiner Charaktere.",
      },
    ],
  },
  fr: {
    name: "Porcinet",
    version: "Fait du chocolat chaud",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "RECETTE SPÉCIALE",
        description:
          "À la fin de votre tour, retirez jusqu'à 2 dommages de chacun de vos personnages.",
      },
    ],
  },
  it: {
    name: "Pimpi",
    version: "Preparatore di Cioccolata Calda",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "RICETTA SPECIALE",
        description: "Alla fine del tuo turno, rimuovi fino a 2 danni da ogni tuo personaggio.",
      },
    ],
  },
};
