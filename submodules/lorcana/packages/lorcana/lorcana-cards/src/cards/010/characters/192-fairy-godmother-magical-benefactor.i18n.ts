import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fairyGodmotherMagicalBenefactorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fairy Godmother",
    version: "Magical Benefactor",
    text: [
      {
        title: "Boost 3 {I}",
      },
      {
        title: "STUNNING TRANSFORMATION",
        description:
          "Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
      },
    ],
  },
  de: {
    name: "Gute Fee",
    version: "Magische Wohltäterin",
    text: [
      {
        title: "Stärken 3",
      },
      {
        title: "BEEINDRUCKENDE VERWANDLUNG",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, darfst du einen gegnerischen Charakter deiner Wahl verbannen. Wenn du dies tust, darf die Person, die den Charakter im Spiel hatte, die oberste Karte ihres Decks aufdecken. Falls sie eine Charakterkarte oder eine Gegenstandskarte ist, darf sie kostenlos ausgespielt werden. Falls nicht, legt die Person sie unter ihr Deck.",
      },
    ],
  },
  fr: {
    name: "La Bonne Fée",
    version: "Bienfaitrice magique",
    text: [
      {
        title: "Boost 3",
      },
      {
        title: "TRANSFORMATION",
        description:
          "Chaque fois que vous placez une carte sous ce personnage, vous pouvez choisir un personnage adverse et le bannir. Si vous le faites, son propriétaire peut révéler la carte du dessus de sa pioche. S'il s'agit d'une carte Personnage ou Objet, il peut la jouer gratuitement. Sinon, il la replace sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Fata Smemorina",
    version: "Benefattrice Magica",
    text: [
      {
        title: "Potenziamento 3",
      },
      {
        title: "TRASFORMAZIONE SBALORDITIVA",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, puoi esiliare un personaggio avversario a tua scelta. Se lo fai, il suo giocatore può rivelare la prima carta del suo mazzo. Se quella carta è una carta personaggio o oggetto, può giocarla gratis. Altrimenti, la mette in fondo al suo mazzo.",
      },
    ],
  },
};
