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
        title: "Unfaire Mittel",
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
        title: "Jouer au plus fin",
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
        title: "Gioco Duro",
        description:
          "Ogni volta che questo personaggio va all'avventura, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "Señora mim",
    version: "Lanzador de conjuros tramposo",
    text: [
      {
        title: "JUGAR BRUTO",
        description:
          "Siempre que este personaje realice una misión, ejerce el personaje contrario elegido.",
      },
    ],
  },
};
