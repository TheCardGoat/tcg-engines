import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteGamesRefereeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Games Referee",
    text: [
      {
        title: "BLOW THE WHISTLE",
        description:
          "When you play this character, opponents can't play actions until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Schiedsrichter der Spiele",
    text: [
      {
        title: "ABPFIFF",
        description:
          "Wenn du diesen Charakter ausspielst, können gegnerische Mitspielende, bis zu Beginn deines nächsten Zuges, keine Aktionen ausspielen.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Arbitre",
    text: [
      {
        title: "SIFFLET!",
        description:
          "Lorsque vous jouez ce personnage, les adversaires ne peuvent pas jouer d'actions jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Arbitro di Gioco",
    text: [
      {
        title: "FISCHIARE",
        description:
          "Quando giochi questo personaggio, gli avversari non possono giocare azioni fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
