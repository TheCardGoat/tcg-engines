import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yaoSnowWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yao",
    version: "Snow Warrior",
    text: [
      {
        title: "OOH, I'M SCARED",
        description: "During opponents' turns, this character gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Yao",
    version: "Schneekrieger",
    text: [
      {
        title: "OOH, ICH HABE ANGST",
        description:
          "Dieser Charakter erhält im Zug einer gegnerischen Person Robust +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Yao",
    version: "Guerrier des neiges",
    text: [
      {
        title: "OOH, J'AI PEUR",
        description: "Durant le tour de vos adversaires, ce personnage gagne Résistance +2.",
      },
    ],
  },
  it: {
    name: "Yao",
    version: "Guerriero delle Nevi",
    text: [
      {
        title: "OOH, CHE PAURA",
        description: "Durante i turni degli avversari, questo personaggio ottiene Resistere +2.",
      },
    ],
  },
};
