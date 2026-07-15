import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteGhostOfChristmasFutureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Ghost of Christmas Future",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "FOREBODING GLANCE",
        description:
          "Whenever this character quests, look at a number of cards from the top of your deck equal to the number of cards under him. Put one into your hand and put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Geist der künftigen Weihnacht",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Blick in die Zukunft",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, schaue dir so viele Karten oben von deinem Deck an wie die Anzahl an Karten unter diesem Charakter. Nimm 1 davon auf deine Hand und lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Fantôme du Noël futur",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Regard menaçant",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, regardez autant de cartes du dessus de votre pioche qu'il y a de cartes sous lui. Ajoutez-en une à votre main et placez les autres cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Fantasma del Natale Futuro",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Sguardo Premonitore",
        description:
          "Ogni volta che questo personaggio va all'avventura, guarda un numero di carte dalla cima del tuo mazzo pari al numero di carte sotto a questo personaggio. Aggiungine una alla tua mano e metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
