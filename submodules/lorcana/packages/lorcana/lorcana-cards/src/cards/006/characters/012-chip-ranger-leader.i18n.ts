import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipRangerLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip",
    version: "Ranger Leader",
    text: [
      {
        title: "THE VALUE OF FRIENDSHIP",
        description:
          "While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Chip",
    version: "Anführer der Ritter des Rechts",
    text: [
      {
        title: "DER WERT DER FREUNDSCHAFT",
        description:
          "Solange du mindestens einen Chap-Charakter im Spiel hast, erhält dieser Charakter Unterstützen. (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Chef des Rangers",
    text: [
      {
        title: "L'IMPORTANCE DE L'AMITIÉ",
        description: "Tant que vous avez un personnage Tac en jeu, ce personnage-ci gagne Soutien.",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Leader degli Agenti Speciali",
    text: [
      {
        title: "IL VALORE DELL'AMICIZIA",
        description:
          "Mentre hai in gioco un personaggio chiamato Ciop, questo personaggio ottiene Aiutante. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
