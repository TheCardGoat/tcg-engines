import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonSchemingSuitorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Scheming Suitor",
    text: [
      {
        title: "YES, I'M INTIMIDATING",
        description:
          "While one or more opponents have no cards in their hands, this character gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Gaston",
    version: "Intriganter Verehrer",
    text: [
      {
        title: "Ich bin furchterregend",
        description:
          "Solange mindestens eine gegnerische Person keine Handkarten hat, erhält dieser Charakter +3 {S}.",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Prétendant fourbe",
    text: [
      {
        title: "Un corps d'Apollon, du plomb dans la tête",
        description: "Tant qu'un adversaire n'a plus de carte en main, ce personnage gagne +3 {S}.",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Scheming Suitor",
    text: [
      {
        title: "Yes, I'm Intimidating",
        description:
          "While one or more opponents have no cards in their hands, this character gets +3 {S}.",
      },
    ],
  },
};
