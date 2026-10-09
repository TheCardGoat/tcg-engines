import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sirKayDeterminedToWinI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sir Kay",
    version: "Determined to Win",
    text: [
      {
        title: "Competitive Edge",
        description:
          "While you have an ink drop, this character gains Challenger +3. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Sir Kay",
    version: "Entschlossen, zu gewinnen",
    text: [
      {
        title: "Wettbewerbsvorteil",
        description:
          "Solange du mindestens einen Tintentropfen hast, erhält dieser Charakter <Herausfordern> +3. (Während der Charakter herausfordert, erhält er +3 {S}.)",
      },
    ],
  },
  fr: {
    name: "Seigneur Kay",
    version: "Déterminé à gagner",
    text: [
      {
        title: "Avantage compétitif",
        description: "Tant que vous avez une goutte d'encre, ce personnage gagne <Offensif> +3.",
      },
    ],
  },
  it: {
    name: "Ser Caio",
    version: "Determinato a Vincere",
    text: [
      {
        title: "Vantaggio Competitivo",
        description:
          "Mentre hai una goccia d'inchiostro, questo personaggio ottiene <Sfidante> +3. (Riceve +3 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Sir Kay",
    version: "Determined to Win",
    text: [
      {
        title: "Competitive Edge",
        description:
          "While you have an ink drop, this character gains Challenger +3. (They get +3 {S} while challenging.)",
      },
    ],
  },
};
