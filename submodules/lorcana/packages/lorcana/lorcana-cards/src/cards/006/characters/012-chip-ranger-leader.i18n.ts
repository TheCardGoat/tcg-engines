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
        title: "Der Wert der Freundschaft",
        description:
          "Solange du mindestens einen Chap-Charakter im Spiel hast, erhält dieser Charakter <Unterstützen>. (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Chef des Rangers",
    text: [
      {
        title: "L'importance de l'amitié",
        description:
          "Tant que vous avez un personnage Tac en jeu, ce personnage-ci gagne <Soutien>. (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Leader degli Agenti Speciali",
    text: [
      {
        title: "Il Valore dell'Amicizia",
        description:
          "Mentre hai in gioco un personaggio chiamato Ciop, questo personaggio ottiene <Aiutante>. (Ogni volta che va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Chip",
    version: "Líder guardabosques",
    text: [
      {
        title: "EL VALOR DE LA AMISTAD",
        description:
          "Mientras tengas un personaje llamado Dale en juego, este personaje obtiene Apoyo. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
      },
    ],
  },
};
