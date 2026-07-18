import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarVengefulLionEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Vengeful Lion",
    text: [
      {
        title: "Ward",
      },
      {
        title: "LIFE'S NOT FAIR, IS IT?",
        description:
          "Whenever one of your characters challenges a damaged character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Rachsüchtiger Löwe",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Die Welt ist so ungerecht, nicht wahr?",
        description:
          "Jedes Mal, wenn einer deiner Charaktere einen beschädigten Charakter herausfordert, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Lion revanchard",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "La vie n'est pas juste, tu vois?",
        description:
          "Chaque fois que l'un de vos personnages défie un personnage ayant au moins un dommage sur lui, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Leone Vendicativo",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "La Vita a Volte È Ingiusta, non È Vero?",
        description:
          "Ogni volta che uno dei tuoi personaggi sfida un personaggio danneggiato, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Cicatriz",
    version: "León vengativo",
    text: [
      {
        title: "Pabellón",
      },
      {
        title: "LA VIDA NO ES JUSTA, ¿CIERTO?",
        description:
          "Siempre que uno de tus personajes desafíe a un personaje dañado, puedes robar una carta.",
      },
    ],
  },
};
