import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mingLeeProudParentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ming Lee",
    version: "Proud Parent",
    text: [
      {
        title: "BIGGEST FAN",
        description:
          "If you have a character named Meilin Lee in play, you pay 1 {} less to play this character.",
      },
      {
        title: "FOLLOW THE MUSIC",
        description: "If you played a song this turn, you pay 1 {} less to play this character.",
      },
    ],
  },
  de: {
    name: "Ming Lee",
    version: "Stolze Mutter",
    text: [
      {
        title: "Größter Fan",
        description:
          "Falls du mindestens einen Charakter namens Meilin Lee im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Folge der Musik",
        description:
          "Falls du in diesem Zug mindestens ein Lied ausgespielt hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Ming Lee",
    version: "Parent fier",
    text: [
      {
        title: "Plus grande fan",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage nommé Meilin Lee en jeu.",
      },
      {
        title: "Suivre la musique",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez joué une chanson ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Ming Lee",
    version: "Mamma Orgogliosa",
    text: [
      {
        title: "La Più Grande Fan",
        description:
          "Se hai in gioco un personaggio chiamato Meilin Lee, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Seguire la Musica",
        description:
          "Se hai giocato una canzone in questo turno, paga 1 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
};
