import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bullseyeLoyalHorseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bullseye",
    version: "Loyal Horse",
    text: [
      {
        title: "LET'S RIDE",
        description:
          "If you have a character named Woody or Jessie in play, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Bully",
    version: "Loyales Pferd",
    text: [
      {
        title: "Reiten wir los",
        description:
          "Falls du einen Woody-Charakter oder einen Jessie-Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Pile-Poil",
    version: "Fidèle destrier",
    text: [
      {
        title: "En selle",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage nommé Woody ou Jessie en jeu.",
      },
    ],
  },
  it: {
    name: "Bullseye",
    version: "Cavallo Leale",
    text: [
      {
        title: "In Sella",
        description:
          "Se hai in gioco un personaggio chiamato Woody o Jessie, paga 1 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
};
