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
        title: "EHRENHAFTER GEIST",
        description:
          "Falls du mindestens einen beschädigten Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "KAMPFGEIST",
        description:
          "Wenn du mindestens einen Charakter mit 5 oder mehr im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Mulan",
    version: "Prête pour la bataille",
    text: [
      {
        title: "ESPRIT NOBLE",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage ayant au moins un dommage en jeu.",
      },
      {
        title: "ESPRIT COMBATIF",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage ayant une de 5 ou plus en jeu.",
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Pronta alla Battaglia",
    text: [
      {
        title: "SPIRITO NOBILE",
        description:
          "Se hai in gioco un personaggio con danno, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "SPIRITO COMBATTIVO",
        description:
          "Se hai in gioco un personaggio con 5 o superiore, paga 1 in meno per giocare questo personaggio.",
      },
    ],
  },
};
