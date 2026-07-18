import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theMadrigalFamilyEveryGenerationEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Madrigal Family",
    version: "Every Generation",
    text: [
      {
        title: "Madrigal Shift 3 {I}",
        description: "(You may pay 3 {I} to play this on top of one of your Madrigal characters.)",
      },
      {
        title: "FAMILY BLESSINGS",
        description:
          "Once during your turn, whenever you remove 1 or more damage from one of your characters, put the top card of your deck into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Die Familie Madrigal",
    version: "Alt und Jung zusammen",
    text: [
      {
        title:
          "<Madrigal-Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Madrigal-Charaktere auszuspielen.)",
      },
      {
        title: "Das Wunder",
        description:
          "Einmal während deines Zuges, wenn du 1 oder mehr Schaden von einem deiner Charaktere entfernst, lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "La famille Madrigal",
    version: "Toutes les générations",
    text: [
      {
        title: "<Alter de Madrigal> 3 {I}",
      },
      {
        title: "Un tel cadeau",
        description:
          "Une fois durant votre tour, lorsque vous retirez 1 dommage ou plus de l'un de vos personnages, placez la carte du dessus de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "La Stirpe Madrigal",
    version: "Tutte le Generazioni",
    text: [
      {
        title:
          "<Trasformazione Madrigal> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi Madrigal.)",
      },
      {
        title: "Brillare di una Luce Unica",
        description:
          "Una volta durante il tuo turno, ogni volta che rimuovi 1 o più danni da uno dei tuoi personaggi, aggiungi la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
  es: {
    name: "La familia Madrigal",
    version: "Cada generación",
    text: [
      {
        title: "Madrigal Turno 3 {I}",
        description:
          "(Puedes pagar 3 {I} para jugar esto encima de uno de tus personajes de Madrigal).",
      },
      {
        title: "BENDICIONES FAMILIARES",
        description:
          "Una vez durante tu turno, cada vez que elimines 1 o más daños de uno de tus personajes, coloca la carta superior de tu mazo en tu tintero boca abajo y ejerce.",
      },
    ],
  },
};
