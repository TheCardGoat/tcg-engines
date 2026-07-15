import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elisaMazaTransformedGargoyleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elisa Maza",
    version: "Transformed Gargoyle",
    text: [
      {
        title: "FOREVER STRONG",
        description: "Your characters' {S} can't be reduced below their printed value.",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Elisa Maza",
    version: "Verwandelte Gargoyle",
    text: [
      {
        title: "Für immer stark",
        description:
          "Die {S} deiner Charaktere kann nicht unter ihren aufgedruckten Wert reduziert werden.",
      },
      {
        title: "Am Tage aus Stein",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Elisa Maza",
    version: "Transformée en gargouille",
    text: [
      {
        title: "Forte pour toujours",
        description:
          "La {S} de vos personnages ne peut pas être réduite en dessous de leur valeur imprimée.",
      },
      {
        title: "Statue le jour",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Elisa Maza",
    version: "Trasformata in Gargoyle",
    text: [
      {
        title: "Forti Per Sempre",
        description:
          "La {S} dei tuoi personaggi non può essere ridotta sotto al suo valore stampato.",
      },
      {
        title: "Statue Di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
