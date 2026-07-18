import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellTheMidasTouchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "The Midas Touch",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "ALL MINE",
        description:
          "Whenever this character quests, gain lore equal to the cost of one of your items in play.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Der Midas-Effekt",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Gundel-Gaukeley-Charaktere auszuspielen.)",
      },
      {
        title: "Alles meins",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, sammle so viele Legenden, wie die Kosten eines deiner Gegenstände im Spiel betragen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Toucher de Midas",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Miss Tick.)",
      },
      {
        title: "Tout est à moi",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, gagnez un nombre d'éclats de Lore égal au coût d'un de vos objets en jeu.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Il Tocco di Mida",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Amelia.)",
      },
      {
        title: "Tutta Mia",
        description:
          "Ogni volta che questo personaggio va all'avventura, ottieni leggenda pari al costo di uno dei tuoi oggetti in gioco.",
      },
    ],
  },
  es: {
    name: "Magia De Hechizo",
    version: "El toque de Midas",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "TODO MIO",
        description:
          "Siempre que este personaje realice una misión, obtendrás un conocimiento equivalente al coste de uno de tus objetos en juego.",
      },
    ],
  },
};
