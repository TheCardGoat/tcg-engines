import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grandmaWuWiseGrandmotherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grandma Wu",
    version: "Wise Grandmother",
    text: [
      {
        title: "<Challenger> +2",
      },
      {
        title: "Ancestral Understanding",
        description: "When you shift a character on top of this character, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Großmutter Wu",
    version: "Weise Großmutter",
    text: [
      {
        title: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
      },
      {
        title: "Ahnenwissen",
        description:
          "Wenn du einen Charakter auf diesen Charakter gestaltwandelst, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Grand-mère Wu",
    version: "Grand-mère avisée",
    text: [
      {
        title: "<Offensif> +2",
      },
      {
        title: "Compréhension ancestrale",
        description:
          "Lorsque vous jouez un personnage via sa capacité Alter sur ce personnage-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Nonna Wu",
    version: "Nonna Saggia",
    text: [
      {
        title: "<Sfidante> +2",
      },
      {
        title: "Consapevolezza Ancestrale",
        description:
          "Quando trasformi un personaggio sopra a questo personaggio, ottieni 1 leggenda.",
      },
    ],
  },
};
