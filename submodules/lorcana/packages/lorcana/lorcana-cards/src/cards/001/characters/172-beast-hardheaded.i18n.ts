import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastHardheadedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Hardheaded",
    text: [
      {
        title: "BREAK",
        description: "When you play this character, you may banish chosen item.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Dickköpfig",
    text: [
      {
        title: "ZERFETZEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "LA BÊTE",
    version: "Colérique et aigrie",
    text: [
      {
        title: "DESTRUCTION",
        description: "Lorsque vous jouez ce personnage, vous pouvez choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Testarda",
    text: [
      {
        title: "ROMPERE",
        description: "Quando giochi questo personaggio, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
