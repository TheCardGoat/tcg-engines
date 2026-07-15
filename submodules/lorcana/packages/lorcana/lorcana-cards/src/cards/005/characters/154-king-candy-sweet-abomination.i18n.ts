import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kingCandySweetAbominationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "King Candy",
    version: "Sweet Abomination",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "CHANGING THE CODE",
        description:
          "When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "King Candy",
    version: "Süße Abscheulichkeit",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner King-Candy-Charaktere auszuspielen.)",
      },
      {
        title: "Den Code verändern",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 2 Karten ziehen, lege dann eine Karte von deiner Hand unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Sa Sucrerie",
    version: "Douce abomination",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Sa Sucrerie.)",
      },
      {
        title: "Changer le code",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez piocher 2 cartes. Si vous le faites, remettez 1 carte de votre main en-dessous de votre pioche.",
      },
    ],
  },
  it: {
    name: "Re Candito",
    version: "Dolce Abominio",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Re Candito.)",
      },
      {
        title: "Modificare il Codice",
        description:
          "Quando giochi questo personaggio, puoi pescare 2 carte, poi metti una carta dalla tua mano in fondo al tuo mazzo.",
      },
    ],
  },
};
