import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naniNoWorriesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani",
    version: "No Worries",
    text: [
      {
        title: "TAKE IT EASY",
        description: "While this character has no damage, she gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Nani",
    version: "Sorglos",
    text: [
      {
        title: "Locker bleiben",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Nani",
    version: "Sans tracas",
    text: [
      {
        title: "Détends-toi",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Nani",
    version: "Rilassata",
    text: [
      {
        title: "Prendersela Comoda",
        description: "Mentre questo personaggio non ha danno, riceve +1 {L}.",
      },
    ],
  },
};
