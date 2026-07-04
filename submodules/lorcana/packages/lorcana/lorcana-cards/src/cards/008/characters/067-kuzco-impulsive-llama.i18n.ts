import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kuzcoImpulsiveLlamaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kuzco",
    version: "Impulsive Llama",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "WHAT DOES THIS DO?",
        description:
          "When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
      },
    ],
  },
  de: {
    name: "Kusco",
    version: "Impulsives Lama",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Kusco-Charaktere auszuspielen.)",
      },
      {
        title: "Was macht der hier?",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle gegnerischen Mitspielenden je einen ihrer Charaktere und legen ihn unter ihr Deck. Dann dürfen alle gegnerischen Mitspielenden je 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Kuzco",
    version: "Lama impétueux",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Kuzco.)",
      },
      {
        title: "Qu'est-ce que ça fait?",
        description:
          "Lorsque vous jouez ce personnage, chaque adversaire choisit l'un de ses personnages et le place sous sa pioche. Ensuite, chaque adversaire peut piocher une carte.",
      },
    ],
  },
  it: {
    name: "Kuzco",
    version: "Lama Impulsivo",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Kuzco.)",
      },
      {
        title: "Cosa Fa Questa?",
        description:
          "Quando giochi questo personaggio, ogni avversario sceglie uno dei suoi personaggi e mette quella carta in fondo al suo mazzo. Poi, ogni avversario può pescare una carta.",
      },
    ],
  },
};
