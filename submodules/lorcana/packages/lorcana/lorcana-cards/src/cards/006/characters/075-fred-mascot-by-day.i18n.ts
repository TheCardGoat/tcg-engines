import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fredMascotByDayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fred",
    version: "Mascot by Day",
    text: [
      {
        title: "HOW COOL IS THAT",
        description: "Whenever this character is challenged, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Fred",
    version: "Maskottchen am Tag",
    text: [
      {
        title: "Wie cool ist das denn?",
        description:
          "Jedes Mal, wenn dieser Charakter herausgefordert wird, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Fred",
    version: "Mascotte la journée",
    text: [
      {
        title: "C'est pas génial?",
        description: "Chaque fois que ce personnage est défié, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Fred",
    version: "Mascotte di Giorno",
    text: [
      {
        title: "Non È Fico?",
        description: "Ogni volta che questo personaggio viene sfidato, ottieni 2 leggenda.",
      },
    ],
  },
};
