import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nickWildePersistentInvestigatorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nick Wilde",
    version: "Persistent Investigator",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "CASE CLOSED",
        description:
          "During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
      },
    ],
  },
  de: {
    name: "Nick Wilde",
    version: "Hartnäckiger Ermittler",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "FALL ABGESCHLOSSEN",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner Detektive durch eine Herausforderung einen anderen Charakter verbannt, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Nick Wilde",
    version: "Investigateur tenace",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "AFFAIRE CLASSÉE",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages Détective bannit un autre personnage via un défi, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Nick Wilde",
    version: "Investigatore Ostinato",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "CASO RISOLTO",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi Detective esilia un altro personaggio in una sfida, pesca una carta.",
      },
    ],
  },
};
