import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gazelleAngelWithHornsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gazelle",
    version: "Angel with Horns",
    text: [
      {
        title: "YOU ARE",
        description:
          "A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Gazelle",
    version: "Engel mit Hörnern",
    text: [
      {
        title: "Du bist ein richtig heißer Tänzer",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Gazelle",
    version: "Ange avec des cornes",
    text: [
      {
        title: "Vous savez bouger",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Gazelle",
    version: "Angelo con le Corna",
    text: [
      {
        title: "Sei un Gran Ballerino",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
