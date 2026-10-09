import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ifSheDoesntScareYouI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "If She Doesn't Scare You",
    text: "Banish chosen character of yours to banish chosen character.",
  },
  de: {
    name: "Durchbohrt dich ihr Blick",
    text: "Wähle und verbanne einen deiner Charaktere, um einen Charakter deiner Wahl zu verbannen.",
  },
  fr: {
    name: "Elle jette tant de sorts",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez l'un de vos personnages et bannissez-le pour choisir un personnage et le bannir.",
      },
    ],
  },
  it: {
    name: "Farebbe Paura",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Esilia un tuo personaggio a tua scelta per esiliare un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "If She Doesn't Scare You",
    text: "Banish chosen character of yours to banish chosen character.",
  },
};
