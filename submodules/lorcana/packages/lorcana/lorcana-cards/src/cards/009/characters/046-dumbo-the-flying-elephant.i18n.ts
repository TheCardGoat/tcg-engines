import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dumboTheFlyingElephantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dumbo",
    version: "The Flying Elephant",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "AERIAL DUO",
        description:
          "When you play this character, chosen character gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Dumbo",
    version: "Der fliegende Elefant",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "LUFT-DUO",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "Dumbo",
    version: "L’éléphant volant",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "DUO AÉRIEN",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Dumbo",
    version: "L'Elefante Volante",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "COPPIA AEREA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
