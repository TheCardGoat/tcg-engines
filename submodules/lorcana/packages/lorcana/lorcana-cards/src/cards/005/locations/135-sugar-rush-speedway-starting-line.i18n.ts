import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sugarRushSpeedwayStartingLineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sugar Rush Speedway",
    version: "Starting Line",
    text: [
      {
        title: "ON YOUR MARKS!",
        description:
          "Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
      },
    ],
  },
  de: {
    name: "Sugar Rush Rennstrecke",
    version: "Startlinie",
    text: [
      {
        title: "AUF DIE PLÄTZE!",
        description:
          "Einmal pro Zug, darfst du einen Charakter deiner Wahl an diesem Ort und ihm 1 Schaden zufügen, um ihn kostenlos zu einem anderen Ort zu bewegen.",
      },
    ],
  },
  fr: {
    name: "Piste de Sugar Rush",
    version: "Ligne de départ",
    text: [
      {
        title: "À VOS MARQUES!",
        description:
          "Une fois par tour, vous pouvez choisir et un personnage sur ce lieu et lui infliger 1 dommage pour le déplacer gratuitement vers un autre lieu.",
      },
    ],
  },
  it: {
    name: "Pista di Sugar Rush",
    version: "Linea di Partenza",
    text: [
      {
        title: "AI VOSTRI POSTI!",
        description:
          "Una volta per turno, puoi un personaggio a tua scelta in questo luogo e infliggergli 1 danno per spostarlo in un altro luogo gratis.",
      },
    ],
  },
};
