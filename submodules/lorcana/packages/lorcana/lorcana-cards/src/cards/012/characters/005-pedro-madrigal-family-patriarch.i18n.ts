import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pedroMadrigalFamilyPatriarchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pedro Madrigal",
    version: "Family Patriarch",
    text: [
      {
        title: "DIFFICULT JOURNEY",
        description: "This character enters play with 1 damage.",
      },
      {
        title: "DEVOTED FAMILY",
        description:
          "When you play this character, if you have another Madrigal character in play, you may remove up to 1 damage from him.",
      },
    ],
  },
  de: {
    name: "Pedro Madrigal",
    version: "Familienpatriarch",
    text: [
      {
        title: "Beschwerliche Reise",
        description: "Dieser Charakter kommt mit 1 Schaden auf ihm ins Spiel.",
      },
      {
        title: "Engagierte Familie",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren Madrigal im Spiel hast, darfst du bis zu 1 Schaden von diesem Charakter entfernen.",
      },
    ],
  },
  fr: {
    name: "Pedro Madrigal",
    version: "Patriarche de la famille",
    text: [
      {
        title: "Voyage difficile",
        description: "Ce personnage entre en jeu avec 1 dommage.",
      },
      {
        title: "Famille dévouée",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage Madrigal en jeu, vous pouvez retirer jusqu'à 1 dommage de ce personnage-ci.",
      },
    ],
  },
  it: {
    name: "Pedro Madrigal",
    version: "Patriarca di Famiglia",
    text: [
      {
        title: "Viaggio Difficile",
        description: "Questo personaggio entra in gioco con 1 danno.",
      },
      {
        title: "Famiglia Devota",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio Madrigal, puoi rimuovere fino a 1 danno da questo personaggio.",
      },
    ],
  },
};
