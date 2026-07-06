import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dashParrSuperFastI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dash Parr",
    version: "Super Fast",
    text: [
      {
        title: "<Shift> 3 {I}",
      },
      {
        title: "<Evasive>",
      },
      {
        title: "Follow Me!",
        description:
          "Whenever this character quests, you may reveal the top card of your deck. If you do, you may play it. Otherwise, put it into your discard. (You pay all costs.)",
      },
    ],
  },
  de: {
    name: "Flash Parr",
    version: "Superschnell",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Flash Parr auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Folge mir!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du die oberste Karte deines Decks aufdecken. Wenn du dies tust, darfst du sie ausspielen. Wenn du sie nicht ausspielst, lege die Karte auf deinen Ablagestapel. (Du bezahlst dabei alle Kosten.)",
      },
    ],
  },
  fr: {
    name: "Flèche Parr",
    version: "Super véloce",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Flèche Parr.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Suis-moi!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez révéler la carte du dessus de votre pioche. Si vous le faites, vous pouvez la jouer. Si vous ne la jouez pas, placez-la dans votre défausse. (Vous payez tous ses coûts.)",
      },
    ],
  },
  it: {
    name: "Flash Parr",
    version: "Velocissimo",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Flash Parr.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Seguitemi!",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi rivelare la prima carta del tuo mazzo. Se lo fai, puoi giocarla. Altrimenti, mettila nei tuoi scarti. (Paga tutti i costi.)",
      },
    ],
  },
};
