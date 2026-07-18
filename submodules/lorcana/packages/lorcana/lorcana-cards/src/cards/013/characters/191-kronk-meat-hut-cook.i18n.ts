import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kronkMeatHutCookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kronk",
    version: "Meat Hut Cook",
    text: [
      {
        title: "<Resist> +1",
      },
      {
        title: "Pickup!",
        description:
          "Once during your turn, you may pay 1 {I} to draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Kronk",
    version: "Fleischbuden-Koch",
    text: [
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Bereit zur Abholung!",
        description:
          "Einmal während deines Zuges darfst du 1 {I} bezahlen, um 1 Karte zu ziehen und danach 1 Karte aus deiner Hand auszuwählen und abzuwerfen.",
      },
    ],
  },
  fr: {
    name: "Kronk",
    version: "Cuisinier à la Poêle à Frire",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title: "On envoie!",
        description:
          "Une fois durant votre tour, vous pouvez payer 1 {I} pour piocher une carte puis défausser une carte.",
      },
    ],
  },
  it: {
    name: "Kronk",
    version: "Cuoco della Casa della Carne",
    text: [
      {
        title: "<Resistere> +1",
      },
      {
        title: "Pronti!",
        description:
          "Una volta durante il tuo turno, puoi pagare 1 {I} per pescare una carta, poi scegli e scarta una carta.",
      },
    ],
  },
  es: {
    name: "Kronk",
    version: "Cocinero de choza de carne",
    text: [
      {
        title: "<Resistir> +1",
      },
      {
        title: "¡Levantar!",
        description:
          "Una vez durante tu turno, puedes pagar 1 {I} para robar una carta, luego elegir y descartar una carta.",
      },
    ],
  },
};
