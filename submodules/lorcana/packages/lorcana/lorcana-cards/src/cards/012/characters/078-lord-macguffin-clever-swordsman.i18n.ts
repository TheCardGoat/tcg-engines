import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lordMacguffinCleverSwordsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lord MacGuffin",
    version: "Clever Swordsman",
    text: [
      {
        title: "WAIT FOR IT...",
        description:
          "This character may enter play exerted to deal 3 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Lord MacGuffin",
    version: "Cleverer Schwertkämpfer",
    text: [
      {
        title: "Abwarten...",
        description:
          "Du darfst diesen Charakter erschöpft ausspielen, um einem beschädigten Charakter deiner Wahl 3 Schaden zuzufügen.",
      },
    ],
  },
  fr: {
    name: "Seigneur MacGuffin",
    version: "Épéiste brillant",
    text: [
      {
        title: "Tu vas voir...",
        description:
          "Ce personnage peut entrer en jeu épuisé pour infliger 3 dommages à un personnage de votre choix ayant au moins un dommage.",
      },
    ],
  },
  it: {
    name: "Lord MacGuffin",
    version: "Spadaccino Astuto",
    text: [
      {
        title: "Aspetta...",
        description:
          "Questo personaggio può entrare in gioco impegnato per infliggere 3 danni a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
