import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaBravingTheStormI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Braving the Storm",
    text: [
      {
        title: "I WAS BORN READY",
        description: "If you have another Hero character in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Dem Sturm trotzend",
    text: [
      {
        title: "ICH BIN SO WAS VON BEREIT",
        description:
          "Wenn du mindestens eine andere Heldin oder einen Held im Spiel hast, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Bravant la tempête",
    text: [
      {
        title: "JE SUIS TOUT À FAIT PRÊTE",
        description:
          "Tant que vous avez un autre personnage Héros en jeu, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Che Affronta la Tempesta",
    text: [
      {
        title: "SONO NATA PRONTA",
        description: "Se hai in gioco un altro personaggio Eroe, questo personaggio riceve +1.",
      },
    ],
  },
};
