import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckLivelyPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Lively Pirate",
    text: [
      {
        title: "DUCK OF ACTION",
        description:
          "Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Lebhafter Pirat",
    text: [
      {
        title: "ENTE DER AKTION",
        description:
          "Jedes Mal, wenn dieser Charakter herausgefordert wird, darfst du 1 Aktionskarte, die keine Liedkarte ist, aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Pirate plein d'entrain",
    text: [
      {
        title: "CANARD D'ACTION",
        description:
          "Chaque fois que ce personnage est défié, vous pouvez renvoyer une carte Action qui n'est pas une chanson de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Pirata Vivace",
    text: [
      {
        title: "PAPERO D'AZIONE",
        description:
          "Ogni volta che questo personaggio viene sfidato, puoi riprendere in mano una carta azione che non è una carta canzone dai tuoi scarti.",
      },
    ],
  },
};
