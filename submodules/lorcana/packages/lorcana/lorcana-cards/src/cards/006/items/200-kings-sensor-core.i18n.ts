import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kingsSensorCoreI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "King's Sensor Core",
    text: [
      {
        title: "SYMBOL OF ROYALTY",
        description: "Your Prince and King characters gain Resist +1.",
      },
      {
        title: "ROYAL SEARCH",
        description:
          "{E}, 2 {I} — Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Sensorkern des Königs",
    text: [
      {
        title: "KÖNIGLICHES SYMBOL",
        description:
          "Deine Prinzen und Könige erhalten Robust +1. (Reduziere jeglichen Schaden, der den Charakteren zugefügt wird, um 1.)",
      },
      {
        title: "KÖNIGLICHE SUCHE,",
        description:
          "2 — Decke die oberste Karte deines Decks auf. Falls es eine Prinz- oder eine König-Charakterkarte ist, darfst du diese auf deine Hand nehmen. Falls nicht, lege sie zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Cœur du détecteur du roi",
    text: [
      {
        title: "SYMBOLE DE ROYAUTÉ",
        description: "Vos personnages Prince et Roi gagnent Résistance +1.",
      },
      {
        title: "RECHERCHE ROYALE, 2",
        description:
          "— Révélez la première carte de votre pioche. S'il s'agit d'un personnage Prince ou Roi, vous pouvez placer cette carte dans votre main. Sinon, replacez cette carte sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Nucleo Rivelatore del Re",
    text: [
      {
        title: "SIMBOLO DI REGALITÀ",
        description: "I tuoi personaggi Principe e Re ottengono Resistere +1.",
      },
      {
        title: "RICERCA REGALE, 2",
        description:
          "— Rivela la prima carta del tuo mazzo. Se è una carta personaggio Principe o Re, puoi aggiungerla alla tua mano. Altrimenti, rimettila in cima al tuo mazzo.",
      },
    ],
  },
};
