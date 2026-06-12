import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const luckyThe15thPuppyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lucky",
    version: "The 15th Puppy",
    text: [
      {
        title: "GOOD AS NEW",
        description:
          "{E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.",
      },
      {
        title: "PUPPY LOVE",
        description:
          "Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Lucky",
    version: "Der 15. Welpe",
    text: [
      {
        title: "EIN PRACHTEXEMPLAR",
        description:
          "— Decke die obersten 3 Karten deines Decks auf. Du darfst davon jeden Charakter, der 2 oder weniger kostet, auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
      {
        title: "HUNDELIEBE",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet und du mindestens 4 weitere Charaktere im Spiel hast, erhalten deine anderen Charaktere in diesem Zug je +1.",
      },
    ],
  },
  fr: {
    name: "Lucky",
    version: "Le 15e chiot",
    text: [
      {
        title: "CE SERA UN COSTAUD",
        description:
          "— Révélez les 3 premières cartes de votre pioche. Vous pouvez ajouter toutes les cartes personnages coûtant 2 ou moins à votre main. Remettez le reste sous votre pioche, dans l'ordre de votre choix.",
      },
      {
        title: "AMOUR DE CHIOT",
        description:
          "Si vous avez au moins 4 autres cartes personnages en jeu lorsque ce personnage est envoyé à l'aventure, vos autres personnages gagnent +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lucky",
    version: "Quindicesimo Cucciolo",
    text: [
      {
        title: "PIÙ VIVO CHE MAI",
        description:
          "— Rivela le prime 3 carte del tuo mazzo. Puoi aggiungere ogni carta personaggio con costo 2 o inferiore alla tua mano. Metti il resto in fondo al tuo mazzo, in qualsiasi ordine.",
      },
      {
        title: "SUPPORTO TRA CUCCIOLI",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai altri 4 o più personaggi in gioco, i tuoi altri personaggi ottengono +1 per questo turno.",
      },
    ],
  },
};
