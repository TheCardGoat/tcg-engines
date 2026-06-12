import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauricesMachineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maurice's Machine",
    text: [
      {
        title: "BREAK DOWN",
        description:
          "When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Maurice’ Maschine",
    text: [
      {
        title: "ZUSAMMENBRUCH",
        description:
          "Wenn dieser Gegenstand verbannt wird, darfst du 1 Gegenstandskarte, die 2 oder weniger kostet, aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Machine de Maurice",
    text: [
      {
        title: "TOMBÉE EN PANNE",
        description:
          "Lorsque cet objet est banni, vous pouvez renvoyer une carte Objet coûtant 2 ou moins de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Marchingegno di Maurice",
    text: [
      {
        title: "SMONTARE",
        description:
          "Quando questo oggetto viene esiliato, puoi riprendere in mano una carta oggetto con costo 2 o inferiore dai tuoi scarti.",
      },
    ],
  },
};
