import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whenYouNeedHelpJustCallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "When You Need Help, Just Call",
    text: "If an opponent has more characters in play than you, you may play a character with cost 4 or less for free.",
  },
  de: {
    name: "Sie sind stets für dich bereit",
    text: "Falls mindestens eine gegnerische Person mehr Charaktere im Spiel hat als du, darfst du einen Charakter, der 4 oder weniger kostet, kostenlos ausspielen.",
  },
  fr: {
    name: "Criez au secours et ils rappliquent",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Si un adversaire a plus de personnages en jeu que vous, vous pouvez jouer gratuitement un personnage coûtant 4 ou moins.",
      },
    ],
  },
  it: {
    name: "Ti Sanno Togliere dai Guai",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Se un avversario ha in gioco più personaggi di te, puoi giocare un personaggio con costo 4 o inferiore gratis.",
      },
    ],
  },
  es: {
    name: "Cuando necesite ayuda, simplemente llame",
    text: "Si un oponente tiene más personajes en juego que tú, puedes jugar con un personaje con un coste de 4 o menos de forma gratuita.",
  },
};
