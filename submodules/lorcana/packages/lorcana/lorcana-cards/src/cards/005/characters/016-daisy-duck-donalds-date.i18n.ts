import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckDonaldsDateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Donald's Date",
    text: [
      {
        title: "BIG PRIZE",
        description:
          "Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Donalds Verabredung",
    text: [
      {
        title: "GROSSER GEWINN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, decken alle gegnerischen Mitspielenden die oberste Karte ihres Decks auf. Falls sie eine Charakterkarte ist, dürfen sie diese auf ihre Hand nehmen. Falls nicht, legen sie diese unter ihr Deck.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Rendez-vous de Donald",
    text: [
      {
        title: "GROS LOT",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, chaque adversaire révèle la carte du dessus de sa pioche. S'il s'agit d'une carte Personnage, il peut la prendre en main. Sinon, il la place sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Paperina",
    version: "Ragazza di Paperino",
    text: [
      {
        title: "PRIMO PREMIO",
        description:
          "Ogni volta che questo personaggio va all'avventura, ogni avversario rivela la prima carta del suo mazzo. Se è una carta personaggio, l'avversario può aggiungerla alla sua mano. Altrimenti, la mette in fondo al suo mazzo.",
      },
    ],
  },
};
