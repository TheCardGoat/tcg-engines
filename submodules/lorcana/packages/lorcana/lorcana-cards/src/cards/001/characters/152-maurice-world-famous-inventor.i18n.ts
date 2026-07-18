import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauriceWorldfamousInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maurice",
    version: "World-Famous Inventor",
    text: [
      {
        title: "GIVE IT",
        description:
          "A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
      },
      {
        title: "IT WORKS!",
        description: "Whenever you play an item, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Maurice",
    version: "Weltberühmter Erfinder",
    text: "Versuch's doch mal Jedes Mal, wenn dieser Charakter erkundet, zahlst du 2 {I} weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.\\Es funktioniert!\\ Jedes Mal, wenn du einen Gegenstand ausspielst, darfst du 1 Karte ziehen.",
  },
  fr: {
    name: "MAURICE",
    version: "Le plus célèbre des inventeurs",
    text: [
      {
        title: "VOYONS VOIR SI ÇA MARCHE",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, le prochain objet que vous jouez durant ce tour coûte 2 {I} de moins.",
      },
      {
        title: "ÇA MARCHE!",
        description: "Lorsque vous jouez un objet, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Maurice",
    version: "World-Famous Inventor",
    text: [
      {
        title: "Give it a Try",
        description:
          "Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
      },
      {
        title: "It Works!",
        description: "Whenever you play an item, you may draw a card.",
      },
    ],
  },
  es: {
    name: "Mauricio",
    version: "Inventor de fama mundial",
    text: [
      {
        title: "dale",
        description:
          "UNA PRUEBA Cada vez que este personaje realiza una misión, pagas 2 {I} menos por el siguiente elemento que juegues en este turno.",
      },
      {
        title: "¡Funciona!",
        description: "Cada vez que juegas un objeto, puedes robar una carta.",
      },
    ],
  },
};
