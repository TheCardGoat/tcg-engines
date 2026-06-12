import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queensSensorCoreI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen's Sensor Core",
    text: [
      {
        title: "SYMBOL OF NOBILITY",
        description:
          "At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
      },
      {
        title: "ROYAL SEARCH",
        description:
          "{E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Sensorkern der Königin",
    text: [
      {
        title: "SYMBOL DES ADELS",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens eine Prinzessin oder eine Königin im Spiel hast, sammelst du 1 Legende.",
      },
      {
        title: "KÖNIGLICHE SUCHE,",
        description:
          "2 — Decke die oberste Karte deines Decks auf. Falls es eine Prinzessin oder eine Königin-Charakterkarte ist, darfst du diese auf deine Hand nehmen. Falls nicht, lege sie zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Cœur du détecteur de la Reine",
    text: [
      {
        title: "SYMBOLE DE NOBLESSE",
        description:
          "Au début de votre tour, si vous avez un personnage Princesse ou Reine en jeu, gagnez 1 éclat de Lore.",
      },
      {
        title: "RECHERCHE ROYALE, 2",
        description:
          "— Révélez la première carte de votre pioche. S'il s'agit d'une carte Personnage Princesse ou Reine, vous pouvez la prendre en main. Sinon, replacez-la sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Nucleo Rivelatore della Regina",
    text: [
      {
        title: "SIMBOLO DI NOBILTÀ",
        description:
          "All'inizio del tuo turno, se hai in gioco un personaggio Principessa o Regina, ottieni 1 leggenda.",
      },
      {
        title: "RICERCA REGALE, 2",
        description:
          "— Rivela la prima carta del tuo mazzo. Se è una carta personaggio Principessa o Regina, puoi aggiungerla alla tua mano. Altrimenti, mettila in cima al tuo mazzo.",
      },
    ],
  },
};
