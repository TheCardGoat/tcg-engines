import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauiHalfsharkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui",
    version: "Half-Shark",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "CHEEEEOHOOOO!",
        description:
          "Whenever this character challenges another character, you may return an action card from your discard to your hand.",
      },
      {
        title: "WAYFINDING",
        description: "Whenever you play an action, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Maui",
    version: "Halb-Hai",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "CHUUUUHUUUU!",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, darfst du 1 Aktionskarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
      {
        title: "WEGWEISEND",
        description: "Jedes Mal, wenn du eine Aktion ausspielst, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Maui",
    version: "Demi-requin",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "CHEEEEHOOOO!",
        description:
          "Chaque fois que ce personnage en défie un autre, vous pouvez renvoyer une carte Action de votre défausse dans votre main.",
      },
      {
        title: "GUIDAGE",
        description: "Chaque fois que vous jouez une action, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Maui",
    version: "Mezzo Squalo",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "TAAAHOOO!",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, puoi riprendere in mano una carta azione dai tuoi scarti.",
      },
      {
        title: "ORIENTARSI",
        description: "Ogni volta che giochi un'azione, ottieni 1 leggenda.",
      },
    ],
  },
};
