import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sleepyHollowTheBridgeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sleepy Hollow",
    version: "The Bridge",
    text: [
      {
        title: "HEAD FOR THE BRIDGE!",
        description:
          "Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Sleepy Hollow",
    version: "Die Brücke",
    text: [
      {
        title: "AUF ZUR BRÜCKE!",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, darfst du diesen Ort verbannen, um 2 Legenden zu sammeln und dem Charakter bis zu Beginn deines nächsten Zuges Wendig zu geben.",
      },
    ],
  },
  fr: {
    name: "Sleepy Hollow",
    version: "Le Pont",
    text: [
      {
        title: "FRANCHISSEZ LE PONT!",
        description:
          "Lorsqu'un personnage sur ce lieu est envoyé à l'aventure, vous pouvez bannir ce lieu pour gagner 2 éclats de Lore et donner à ce personnage Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "La Valle Addormentata",
    version: "Il Ponte",
    text: [
      {
        title: "VERSO IL PONTE!",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, puoi esiliare questo luogo per ottenere 2 leggenda e dargli Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
