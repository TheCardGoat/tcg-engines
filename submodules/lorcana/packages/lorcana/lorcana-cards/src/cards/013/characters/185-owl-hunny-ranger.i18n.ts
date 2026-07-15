import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const owlHunnyRangerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Owl",
    version: "Hunny Ranger",
    text: [
      {
        title: "HUNNY ALLIANCE",
        description:
          "While you have another Hunny character in play, this character gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Eule",
    version: "Honig-Ranger",
    text: [
      {
        title: "Honig-Allianz",
        description:
          "Solange du mindestens einen weiteren Honig-Charakter im Spiel hast, erhält dieser Charakter <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Maître Hibou",
    version: "Rôdeur mellifique",
    text: [
      {
        title: "Alliance mellifique",
        description:
          "Tant que vous avez un autre personnage Miel en jeu, ce personnage-ci gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Uffa",
    version: "Ranger del Miele",
    text: [
      {
        title: "Alleanza del Miele",
        description:
          "Mentre hai in gioco un altro personaggio Miele, questo personaggio ottiene <Resistere> +2.",
      },
    ],
  },
};
