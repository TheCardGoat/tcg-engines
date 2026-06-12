import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cheshireCatPerplexingFelineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cheshire Cat",
    version: "Perplexing Feline",
    text: [
      {
        title: "MAD GRIN",
        description:
          "When you play this character, you may deal 2 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Grinsekatze",
    version: "Verwirrende Katze",
    text: [
      {
        title: "VERRÜCKTES GRINSEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem beschädigten Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Chat du Cheshire",
    version: "Félin déroutant",
    text: [
      {
        title: "SOURIRE DÉMENT",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage avec au moins un dommage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Stregatto",
    version: "Felino Sconcertante",
    text: [
      {
        title: "FOLLE GHIGNO",
        description:
          "Quando giochi questo personaggio, puoi infliggere 2 danni a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
