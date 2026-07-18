import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const worldsGreatestCriminalMindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "World's Greatest Criminal Mind",
    text: "Banish chosen character with 5 {S} or more.",
  },
  de: {
    name: "Oh, Rattenzahn!",
    text: "Verbanne einen Charakter deiner Wahl mit 5 oder mehr {S}.",
  },
  fr: {
    name: "Le Grand Génie du Mal",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage ayant au moins 5 {S} et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Oh, Rattigan!",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Esilia un personaggio a tua scelta con 5 {S} o superiore.",
      },
    ],
  },
  es: {
    name: "La mente criminal más grande del mundo",
    text: "Destierra al personaje elegido con 5 {S} o más.",
  },
};
