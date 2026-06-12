import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefBogoGazelleFanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief Bogo",
    version: "Gazelle Fan",
    text: [
      {
        title: "YOU LIKE GAZELLE TOO?",
        description:
          "While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)",
      },
    ],
  },
  de: {
    name: "Chief Bogo",
    version: "Gazelle-Fan",
    text: [
      {
        title: "DU MAGST GAZELLE AUCH?",
        description:
          "Solange du mindestens einen Gazelle-Charakter im Spiel hast, erhält dieser Charakter Singen 6. (Die Kosten dieses Charakters gelten als 6 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Chef Bogo",
    version: "Fan de Gazelle",
    text: [
      {
        title: "VOUS AUSSI, VOUS AIMEZ GAZELLE?",
        description:
          "Tant que vous avez un personnage Gazelle en jeu, ce personnage-ci gagne Mélomane 6. (Ce personnage est considéré comme ayant un coût de 6 pour chanter des chansons.)",
      },
    ],
  },
  it: {
    name: "Capitano Bogo",
    version: "Fan di Gazelle",
    text: [
      {
        title: "ANCHE A LEI PIACE GAZELLE?",
        description:
          "Mentre hai in gioco un personaggio chiamato Gazelle, questo personaggio ottiene Melodioso 6.",
      },
    ],
  },
};
