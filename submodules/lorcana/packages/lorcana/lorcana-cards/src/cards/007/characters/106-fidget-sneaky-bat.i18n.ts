import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fidgetSneakyBatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fidget",
    version: "Sneaky Bat",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "I TOOK CARE OF EVERYTHING",
        description:
          "Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Greifer",
    version: "Hinterhältige Fledermaus",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Ich habe mich um alles gekümmert",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen deiner anderen Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Fidget",
    version: "Chauve-souris furtive",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "J'ai tout ce qu'il vous fallait",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un autre de vos personnages qui gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Vampirello",
    version: "Pipistrello Furtivo",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Ho Preso Tutto",
        description:
          "Ogni volta che questo personaggio va all'avventura, un tuo altro personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Agitarse",
    version: "Murciélago astuto",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "YO ME CUIDÉ DE TODO",
        description:
          "Cada vez que este personaje realiza una misión, otro personaje tuyo elegido obtiene Evasivo hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
