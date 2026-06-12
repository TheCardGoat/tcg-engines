import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hansNobleScoundrelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hans",
    version: "Noble Scoundrel",
    text: [
      {
        title: "ROYAL SCHEMES",
        description:
          "When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Hans",
    version: "Adeliger Halunke",
    text: [
      {
        title: "KÖNIGLICHE PLÄNE",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens eine Prinzessin oder eine Königin im Spiel ist, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Hans",
    version: "Noble crapule",
    text: [
      {
        title: "INTRIGUES ROYALES",
        description:
          "S'il y a un personnage Princesse ou Reine en jeu lorsque vous jouez ce personnage, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Hans",
    version: "Nobile Furfante",
    text: [
      {
        title: "COMPLOTTI REGALI",
        description:
          "Quando giochi questo personaggio, se un personaggio Principessa o Regina è in gioco, ottieni 1 leggenda.",
      },
    ],
  },
};
