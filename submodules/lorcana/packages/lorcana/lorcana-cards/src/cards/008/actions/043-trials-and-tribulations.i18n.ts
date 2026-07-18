import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trialsAndTribulationsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Trials and Tribulations",
    text: "Chosen character gets -4 {S} until the start of your next turn.",
  },
  de: {
    name: "Oft war ich verzweifelt",
    text: "Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -4 {S}.",
  },
  fr: {
    name: "Je travaillerai sans trêve",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage qui subit -4 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Mille Ostacoli e Impedimenti",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Un personaggio a tua scelta riceve -4 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Pruebas y tribulaciones",
    text: "El personaje elegido obtiene -4 {S} hasta el inicio de tu siguiente turno.",
  },
};
