import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarBetrayerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Betrayer",
    text: [
      {
        title: "LONG LIVE THE KING",
        description: "When you play this character, you may banish chosen character named Mufasa.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Verräter",
    text: [
      {
        title: "Lang lebe der König",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Mufasa-Charakter deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Traître",
    text: [
      {
        title: "Longue vie au roi",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage Mufasa et le bannir.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Traditore",
    text: [
      {
        title: "Lunga Vita al Re",
        description:
          "Quando giochi questo personaggio, puoi esiliare un personaggio chiamato Mufasa a tua scelta.",
      },
    ],
  },
};
