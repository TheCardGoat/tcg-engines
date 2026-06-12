import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const doloresMadrigalWithinEarshotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dolores Madrigal",
    version: "Within Earshot",
    text: [
      {
        title: "I HEAR YOU",
        description:
          "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
      },
    ],
  },
  de: {
    name: "Dolores Madrigal",
    version: "In Hörweite",
    text: [
      {
        title: "ICH HÖR' DICH",
        description:
          "Jedes Mal, wenn einer deiner Charaktere ein Lied singt, zeigt eine gegnerische Person deiner Wahl all ihre Handkarten für alle sichtbar vor.",
      },
    ],
  },
  fr: {
    name: "Dolores Madrigal",
    version: "À portée d’oreille",
    text: [
      {
        title: "JE T'ENTENDS, OUI",
        description:
          "Chaque fois qu'un ou plusieurs de vos personnages chantent une chanson, choisissez un adversaire qui révèle sa main.",
      },
    ],
  },
  it: {
    name: "Dolores Madrigal",
    version: "A Portata di Orecchio",
    text: [
      {
        title: "TI SENTO",
        description:
          "Ogni volta che uno dei tuoi personaggi canta una canzone, un avversario a tua scelta rivela la sua mano.",
      },
    ],
  },
};
