import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thisIsBusinessI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "This Is Business",
    text: [
      {
        title: "Chosen opponent chooses one:",
      },
      {
        title:
          "• They reveal their hand and discard a card of your choice. They get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
      },
      {
        title: "• You draw a card and get 2 ink drops.",
      },
    ],
  },
  de: {
    name: "Das ist das Geschäft",
    text: [
      {
        title: "Eine gegnerische Person deiner Wahl sucht sich eine Möglichkeit aus:",
      },
      {
        title:
          "• Sie zeigt alle Handkarten vor und wirft eine Karte deiner Wahl ab. Sie erhält 2 Tintentropfen. (Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
      },
      {
        title: "• Du ziehst 1 Karte und erschaffst 2 Tintentropfen.",
      },
    ],
  },
  fr: {
    name: "Ce sont les affaires",
    text: [
      {
        title: "Choisissez un adversaire qui choisit entre:",
      },
      {
        title:
          "• Il révèle sa main et défausse une carte de votre choix. Il gagne 2 gouttes d'encre.",
      },
      {
        title:
          "• Vous piochez une carte et gagnez 2 gouttes d'encre. (Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Sono Affari",
    text: [
      {
        title: "Un avversario a tua scelta sceglie uno:",
      },
      {
        title:
          "• L'avversario rivela la sua mano e scarta una carta a tua scelta. Riceve 2 gocce d'inchiostro. (Ogni goccia d'inchiostro può essere rimossa per pagare 1 {I}.)",
      },
      {
        title: "• Tu peschi una carta e ricevi 2 gocce d'inchiostro.",
      },
    ],
  },
  es: {
    name: "This Is Business",
    text: [
      {
        title: "Chosen opponent chooses one:",
      },
      {
        title:
          "• They reveal their hand and discard a card of your choice. They get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
      },
      {
        title: "• You draw a card and get 2 ink drops.",
      },
    ],
  },
};
