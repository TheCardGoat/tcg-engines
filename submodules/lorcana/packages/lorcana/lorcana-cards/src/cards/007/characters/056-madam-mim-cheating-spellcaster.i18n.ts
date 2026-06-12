import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimCheatingSpellcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Cheating Spellcaster",
    text: [
      {
        title: "PLAY ROUGH",
        description: "Whenever this character quests, exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Betrügerische Zauberkünstlerin",
    text: [
      {
        title: "UNFAIRE MITTEL",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "Sorcière tricheuse",
    text: [
      {
        title: "JOUER AU PLUS FIN",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Fattucchiera Imbrogliona",
    text: [
      {
        title: "GIOCO DURO",
        description:
          "Ogni volta che questo personaggio va all'avventura, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
};
