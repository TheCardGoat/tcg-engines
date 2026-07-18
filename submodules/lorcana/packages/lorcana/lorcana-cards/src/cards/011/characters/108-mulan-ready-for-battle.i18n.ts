import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanReadyForBattleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Ready for Battle",
    text: [
      {
        title: "NOBLE SPIRIT",
        description:
          "If you have a character in play with damage, you pay 1 {I} less to play this character.",
      },
      {
        title: "FIGHTING SPIRIT",
        description:
          "If you have a character in play with 5 or more, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Mulan",
    version: "Bereit für die Schlacht",
    text: [
      {
        title: "Ehrenhafter Geist",
        description:
          "Falls du mindestens einen beschädigten Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Kampfgeist",
        description:
          "Wenn du mindestens einen Charakter mit 5 oder mehr {S} im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Mulan",
    version: "Prête pour la bataille",
    text: [
      {
        title: "Esprit noble",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage ayant au moins un dommage en jeu.",
      },
      {
        title: "Esprit combatif",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage ayant une {S} de 5 ou plus en jeu.",
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Pronta alla Battaglia",
    text: [
      {
        title: "Spirito Nobile",
        description:
          "Se hai in gioco un personaggio con danno, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Spirito Combattivo",
        description:
          "Se hai in gioco un personaggio con 5 {S} o superiore, paga 1 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
  es: {
    name: "Mulán",
    version: "Listo para la batalla",
    text: [
      {
        title: "ESPÍRITU NOBLE",
        description:
          "Si tienes un personaje en juego con daño, pagas 1 {I} menos para jugar con este personaje.",
      },
      {
        title: "ESPÍRITU DE LUCHA",
        description:
          "Si tienes un personaje en juego con 5 o más, pagas 1 {I} menos para interpretar a este personaje.",
      },
    ],
  },
};
