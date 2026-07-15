import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bouncingDuckySidsToyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bouncing Ducky",
    version: "Sid's Toy",
    text: [
      {
        title: "REJECTED TOYS",
        description:
          "For each Toy character card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "REPURPOSED",
        description:
          "When you play this character, put all Toy character cards from your discard on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Ducki",
    version: "Sids Spielzeug",
    text: [
      {
        title: "Zurückgewiesene Spielzeuge",
        description:
          "Für jede Spielzeug-Charakterkarte in deinem Ablagestapel zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Umfunktioniert",
        description:
          "Wenn du diesen Charakter ausspielst, lege alle Spielzeug-Charakterkarten aus deinem Ablagestapel in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Canard",
    version: "Jouet de Sid",
    text: [
      {
        title: "Jouets rejetés",
        description:
          "Jouer ce personnage coûte 1 {I} de moins pour chaque carte Personnage Jouet dans votre défausse.",
      },
      {
        title: "Réutilisé",
        description:
          "Lorsque vous jouez ce personnage, placez sous votre pioche toutes les cartes Personnage Jouet de votre défausse, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Anatroccolo a Molla",
    version: "Giocattolo di Sid",
    text: [
      {
        title: "Giocattoli Scartati",
        description:
          "Per ogni carta personaggio Giocattolo nei tuoi scarti, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Riqualificati",
        description:
          "Quando giochi questo personaggio, metti tutte le carte personaggio Giocattolo dai tuoi scarti in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
