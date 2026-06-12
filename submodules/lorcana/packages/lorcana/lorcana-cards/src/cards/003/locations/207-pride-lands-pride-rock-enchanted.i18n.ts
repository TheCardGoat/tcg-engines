import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const prideLandsPrideRockEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "WIR SIND ALLE EINS",
        description: "Charaktere an diesem Ort erhalten +2.",
      },
      {
        title: "ZUHAUSE DER LÖWEN",
        description:
          "Wenn du mindestens einen Prinz oder einen König an diesem Ort hast, zahlst du 1 weniger, um Charaktere auszuspielen.",
      },
    ],
  },
  fr: {
    name: "La Terre des Lions",
    version: "Le rocher des lions",
    text: [
      {
        title: "C'EST COMME LES MAILLONS D'UNE CHAÎNE",
        description: "Les personnages sur ce lieu gagnent +2.",
      },
      {
        title: "DEMEURE DES LIONS",
        description:
          "Si un personnage Prince ou Roi se trouve sur ce lieu, jouer des personnages vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Terre del Branco",
    version: "La Rupe dei Re",
    text: [
      {
        title: "SIAMO TUTTI COLLEGATI I",
        description: "personaggi ricevono +2 mentre si trovano in questo luogo.",
      },
      {
        title: "CASA DEL LEONE",
        description:
          "Se un personaggio Principe o Re si trova in questo luogo, paga 1 in meno per giocare i personaggi.",
      },
    ],
  },
};
