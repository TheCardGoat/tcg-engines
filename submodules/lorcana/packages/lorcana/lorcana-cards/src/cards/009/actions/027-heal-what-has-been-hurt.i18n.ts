import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const healWhatHasBeenHurtI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heal What Has Been Hurt",
    text: "Remove up to 3 damage from chosen character. Draw a card.",
  },
  de: {
    name: "Lass mich nicht allein",
    text: "Entferne bis zu 3 Schaden von einem Charakter deiner Wahl. Ziehe 1 Karte.",
  },
  fr: {
    name: "Guéris les blessures",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage et retirez-lui jusqu'à 3 jetons Dommage. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Incanto della Guarigione",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title: "Rimuovi fino a 3 danni da un personaggio a tua scelta. Pesca una carta.",
      },
    ],
  },
  es: {
    name: "Sanar lo que ha sido herido",
    text: "Elimina hasta 3 daños del personaje elegido. Saca una carta.",
  },
};
