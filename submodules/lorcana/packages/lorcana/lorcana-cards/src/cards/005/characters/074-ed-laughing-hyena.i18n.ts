import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const edLaughingHyenaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ed",
    version: "Laughing Hyena",
    text: [
      {
        title: "CAUSE A PANIC",
        description:
          "When you play this character, you may deal 2 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Ed",
    version: "Lachende Hyäne",
    text: [
      {
        title: "PANIK AUSLÖSEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem beschädigten Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Ed",
    version: "Hyène rieuse",
    text: [
      {
        title: "VAGUE DE PEUR",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage ayant au moins un dommage sur lui et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Ed",
    version: "Iena Ridens",
    text: [
      {
        title: "SCATENARE IL PANICO",
        description:
          "Quando giochi questo personaggio, puoi infliggere 2 danni a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
