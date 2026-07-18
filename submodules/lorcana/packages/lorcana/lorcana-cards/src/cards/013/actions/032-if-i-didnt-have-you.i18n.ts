import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ifIDidntHaveYouI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "If I Didn't Have You",
    text: "You and another chosen player each draw 2 cards.",
  },
  de: {
    name: "Ohne dich",
    text: "Du und eine weitere Person deiner Wahl zieht je 2 Karten.",
  },
  fr: {
    name: "Si je ne t'avais pas",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Vous et un autre joueur de votre choix piochez chacun 2 cartes.",
      },
    ],
  },
  it: {
    name: "Se Non Fossi Con Te",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Tu e un altro giocatore a tua scelta pescate 2 carte ciascuno.",
      },
    ],
  },
  es: {
    name: "Si no te tuviera",
    text: "Tú y otro jugador elegido roban 2 cartas cada uno.",
  },
};
