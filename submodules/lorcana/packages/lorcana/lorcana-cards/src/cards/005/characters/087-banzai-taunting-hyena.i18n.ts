import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const banzaiTauntingHyenaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Banzai",
    version: "Taunting Hyena",
    text: [
      {
        title: "HERE KITTY, KITTY, KITTY",
        description: "When you play this character, you may exert chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Banzai",
    version: "Verhöhnende Hyäne",
    text: [
      {
        title: "MIEZ, MIEZ, MIEZ",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen beschädigten Charakter deiner Wahl erschöpfen.",
      },
    ],
  },
  fr: {
    name: "Banzaï",
    version: "Hyène railleuse",
    text: [
      {
        title: "MINOU MINOU MINOU...",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage ayant au moins un dommage sur lui et l'épuiser.",
      },
    ],
  },
  it: {
    name: "Banzai",
    version: "Iena Sarcastica",
    text: [
      {
        title: "VIENI MICIO, MICIO, MICIO",
        description:
          "Quando giochi questo personaggio, puoi impegnare un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
