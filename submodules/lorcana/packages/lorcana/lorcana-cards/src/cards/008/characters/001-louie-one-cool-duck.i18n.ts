import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const louieOneCoolDuckI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Louie",
    version: "One Cool Duck",
    text: [
      {
        title: "SPRING THE TRAP",
        description:
          "While this character is being challenged, the challenging character gets -1 {S}.",
      },
    ],
  },
  de: {
    name: "Track Duck",
    version: "Eine coole Ente",
    text: [
      {
        title: "Löst die Falle aus",
        description:
          "Während dieser Charakter herausgefordert wird, erhält der herausfordernde Charakter -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Loulou",
    version: "Canard trop cool",
    text: [
      {
        title: "Déclencher le piège",
        description: "Tant que ce personnage est défié, le personnage le défiant subit -1 {S}.",
      },
    ],
  },
  it: {
    name: "Qua",
    version: "Papero Davvero Disinvolto",
    text: [
      {
        title: "Far Scattare la Trappola",
        description:
          "Mentre questo personaggio viene sfidato, il personaggio sfidante riceve -1 {S}.",
      },
    ],
  },
};
