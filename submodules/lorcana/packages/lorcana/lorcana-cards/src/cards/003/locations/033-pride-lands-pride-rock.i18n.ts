import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const prideLandsPrideRockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pride Lands",
    version: "Pride Rock",
    text: [
      {
        title: "WE ARE ALL CONNECTED",
        description: "Characters get +2 {W} while here.",
      },
      {
        title: "LION HOME",
        description:
          "If you have a Prince or King character here, you pay 1 {I} less to play characters.",
      },
    ],
  },
  de: {
    name: "Das Geweihte Land",
    version: "Königsfelsen",
    text: [
      {
        title: "Wir sind alle eins",
        description: "Charaktere an diesem Ort erhalten +2 {W}.",
      },
      {
        title: "Zuhause der Löwen",
        description:
          "Wenn du mindestens einen Prinz oder einen König an diesem Ort hast, zahlst du 1 {I} weniger, um Charaktere auszuspielen.",
      },
    ],
  },
  fr: {
    name: "La Terre des Lions",
    version: "Le rocher des lions",
    text: [
      {
        title: "C'est comme les maillons d'une chaîne",
        description: "Les personnages sur ce lieu gagnent +2 {W}.",
      },
      {
        title: "Demeure des Lions",
        description:
          "Si un personnage Prince ou Roi se trouve sur ce lieu, jouer des personnages vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Terre del Branco",
    version: "La Rupe dei Re",
    text: [
      {
        title: "Siamo Tutti Collegati",
        description: "I personaggi ricevono +2 {W} mentre si trovano in questo luogo.",
      },
      {
        title: "Casa del Leone",
        description:
          "Se un personaggio Principe o Re si trova in questo luogo, paga 1 {I} in meno per giocare i personaggi.",
      },
    ],
  },
};
