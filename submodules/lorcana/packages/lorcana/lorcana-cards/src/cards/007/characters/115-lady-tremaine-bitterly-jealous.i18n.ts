import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyTremaineBitterlyJealousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady Tremaine",
    version: "Bitterly Jealous",
    text: [
      {
        title: "THAT'S QUITE ENOUGH",
        description:
          "{E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
      },
    ],
  },
  de: {
    name: "Gräfin Tremaine",
    version: "Zutiefst neidisch",
    text: [
      {
        title: "JETZT",
        description:
          "HÖRT IHR AUF — Schicke einen beschädigten Charakter deiner Wahl auf die zugehörige Hand zurück. Danach müssen alle gegnerischen Mitspielenden je eine zufällig ausgewählte Karte von ihrer Hand abwerfen.",
      },
    ],
  },
  fr: {
    name: "Madame de Trémaine",
    version: "Amèrement jalouse",
    text: [
      {
        title: "CELA SUFFIT",
        description:
          "— Choisissez un personnage avec au moins un dommage et renvoyez-le dans la main de son propriétaire. Ensuite, chaque adversaire défausse une carte au hasard.",
      },
    ],
  },
  it: {
    name: "La Matrigna",
    version: "Tremendamente Invidiosa",
    text: [
      {
        title: "ADESSO BASTA",
        description:
          "— Fai riprendere in mano al suo giocatore un personaggio danneggiato a tua scelta. Poi, ogni avversario scarta una carta a caso.",
      },
    ],
  },
};
