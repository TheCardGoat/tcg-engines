import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jessieLivelyCowgirlI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jessie",
    version: "Lively Cowgirl",
    text: [
      {
        title: "PART OF",
        description:
          "A FAMILY Whenever this character quests, if you have 2 or more other Toy characters in play, you may draw a card.",
      },
      {
        title: "YODEL-AY-HEE-HOO!",
        description:
          "Whenever you pay 2 {I} or less to play a card, chosen opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Jessie",
    version: "Lebhaftes Cowgirl",
    text: [
      {
        title: "Teil einer Familie",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du mindestens 2 weitere Spielzeuge im Spiel hast, darfst du 1 Karte ziehen.",
      },
      {
        title: "Jodel-a-hii-hoo!",
        description:
          "Jedes Mal, wenn du 2 oder weniger {I} bezahlst, um eine Karte auszuspielen, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Jessie",
    version: "Cowgirl énergique",
    text: [
      {
        title: "Partie d'une vraie famille",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez 2 autres personnages Jouet ou plus en jeu, vous pouvez piocher une carte.",
      },
      {
        title: "Yodel-ay-hee-hoo!",
        description:
          "Chaque fois que vous payez 2 {I} ou moins pour jouer une carte, choisissez un personnage adverse qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Jessie",
    version: "Vivace Cowgirl",
    text: [
      {
        title: "Parte di una Famiglia",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai in gioco 2 o più altri personaggi Giocattolo, puoi pescare una carta.",
      },
      {
        title: "Olla-la-la-i-ooo!",
        description:
          "Ogni volta che paghi 2 {I} o meno per giocare una carta, un personaggio avversario a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
