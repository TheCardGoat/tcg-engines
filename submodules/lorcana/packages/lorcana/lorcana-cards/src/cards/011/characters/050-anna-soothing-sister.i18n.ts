import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaSoothingSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Soothing Sister",
    text: [
      {
        title: "UNUSUAL TRANSFORMATION",
        description: "If a card left a player's discard this turn, this card gains Shift 0 {I}.",
      },
      {
        title: "WARM HEART",
        description:
          "Whenever this character quests, you may gain lore equal to the {L} of a character card in your discard. If you do, put that card on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Beruhigende Schwester",
    text: [
      {
        title: "UNGEWÖHNLICHE TRANSFORMATION",
        description:
          "Falls in diesem Zug eine Karte einen Ablagestapel verlassen hat, erhält diese Karte Gestaltwandel 0",
      },
      {
        title: "WARMES HERZ",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du eine Charakterkarte in deinem Ablagestapel wählen und so viele Legenden sammeln, wie dessen Legendenwert beträgt. Wenn du dies tust, lege die gewählte Karte danach unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Sœur rassurante",
    text: [
      {
        title: "TRANSFORMATION ATYPIQUE",
        description:
          "Si une carte a quitté la défausse d'un joueur ce tour-ci, cette carte-ci gagne Alter 0.",
      },
      {
        title: "CŒUR CHALEUREUX",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez gagner autant d'éclats de Lore que le d'une carte Personnage de votre défausse. Si vous le faites, placez cette carte-là sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Sorella Rassicurante",
    text: [
      {
        title: "TRASFORMAZIONE INUSUALE",
        description:
          "Se una carta ha lasciato gli scarti di un giocatore in questo turno, questa carta ottiene Trasformazione 0.",
      },
      {
        title: "BUON CUORE",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi ottenere leggenda pari al di una carta personaggio nei tuoi scarti. Se lo fai, metti quella carta in fondo al tuo mazzo.",
      },
    ],
  },
};
