import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyFamilyDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady",
    version: "Family Dog",
    text: [
      {
        title: "SOMEONE TO CARE FOR",
        description:
          "When you play this character, you may play a character with cost 2 or less for free.",
      },
    ],
  },
  de: {
    name: "Susi",
    version: "Familien-Hundedame",
    text: [
      {
        title: "JEMAND, FÜR DEN MAN SORGT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter, der 2 oder weniger kostet, kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Lady",
    version: "Chienne de famille",
    text: [
      {
        title: "QUELQU'UN DONT ON DOIT S'OCCUPER",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez jouer gratuitement un personnage coûtant 2 ou moins.",
      },
    ],
  },
  it: {
    name: "Lilli",
    version: "Cagnolina di Famiglia",
    text: [
      {
        title: "QUALCUNO DA ACCUDIRE",
        description:
          "Quando giochi questo personaggio, puoi giocare un personaggio con costo 2 o inferiore gratis.",
      },
    ],
  },
};
