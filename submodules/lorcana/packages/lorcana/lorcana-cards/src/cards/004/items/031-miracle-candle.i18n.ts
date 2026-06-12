import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const miracleCandleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Miracle Candle",
    text: [
      {
        title: "ABUELA'S GIFT",
        description:
          "Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
      },
    ],
  },
  de: {
    name: "Wunderkerze",
    text: [
      {
        title: "ABUELAS GABE",
        description:
          "Verbanne diesen Gegenstand — Wenn du mindestens 3 Charaktere im Spiel hast, sammle 2 Legenden und entferne bis zu 2 Schaden von einem Ort deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "La Chandelle du Miracle",
    text: [
      {
        title: "LE DON D'ABUELA",
        description:
          "Bannissez cet objet — Si vous avez 3 personnages ou plus en jeu, gagnez 2 éclats de Lore et choisissez un lieu et retirez-lui jusqu'à 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Candela del Miracolo",
    text: [
      {
        title: "IL TALENTO DI ABUELA",
        description:
          "Esilia questo oggetto — Se hai in gioco 3 o più personaggi, ottieni 2 leggenda e rimuovi fino a 2 danni da un luogo a tua scelta.",
      },
    ],
  },
};
