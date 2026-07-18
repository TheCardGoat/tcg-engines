import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grabYourBowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grab Your Bow",
    text: "Banish up to 2 chosen characters with 2 {S} or less.",
  },
  de: {
    name: "Nehmt den Pfeil",
    text: "Verbanne bis zu 2 Charaktere deiner Wahl mit 2 oder weniger {S}.",
  },
  fr: {
    name: "À vos flèches",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez jusqu'à 2 personnages ayant 2 {S} ou moins et bannissez-les.",
      },
    ],
  },
  it: {
    name: "Siamo Eroi",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Esilia fino a 2 personaggi a tua scelta con 2 {S} o inferiore.",
      },
    ],
  },
  es: {
    name: "Coge tu arco",
    text: "Destierra hasta 2 personajes elegidos con 2 {S} o menos.",
  },
};
