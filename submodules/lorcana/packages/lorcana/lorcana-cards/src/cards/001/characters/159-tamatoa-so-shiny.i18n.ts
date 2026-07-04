import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tamatoaSoShinyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tamatoa",
    version: "So Shiny!",
    text: [
      {
        title: "WHAT HAVE WE HERE?",
        description:
          "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      },
      {
        title: "GLAM",
        description: "This character gets +1 {L} for each item you have in play.",
      },
    ],
  },
  de: {
    name: "Tamatoa",
    version: "So glänzend!",
    text: "Was haben wir denn hier? Wenn du diesen Charakter ausspielst und jedes Mal, wenn er erkundet, darfst du 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand nehmen.\\Glamourös\\ Dieser Charakter erhält +1 {L} für jeden Gegenstand, den du im Spiel hast.",
  },
  fr: {
    name: "TAMATOA",
    version: "Bling-bling",
    text: [
      {
        title: "MAIS QU'AVONS NOUS LÀ?",
        description:
          "Lorsque vous jouez ce personnage ou qu'il est envoyé à l'aventure, vous pouvez reprendre en main une carte objet de votre défausse.",
      },
      {
        title: "SPLENDIDE",
        description: "Ce personnage a +1 {L} pour chaque objet que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Tamatoa",
    version: "So Shiny!",
    text: [
      {
        title: "What Have We Here?",
        description:
          "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      },
      {
        title: "Glam",
        description: "This character gets +1 {L} for each item you have in play.",
      },
    ],
  },
};
