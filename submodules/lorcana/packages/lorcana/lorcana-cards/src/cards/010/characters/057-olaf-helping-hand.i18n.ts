import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafHelpingHandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Helping Hand",
    text: [
      {
        title: "SECOND CHANCE",
        description:
          "When this character leaves play, you may return chosen character of yours to your hand.",
      },
    ],
  },
  de: {
    name: "Olaf",
    version: "Helfende Hand",
    text: [
      {
        title: "ZWEITE CHANCE",
        description:
          "Wenn dieser Charakter das Spiel verlässt, darfst du einen deiner Charaktere wählen und ihn zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Tend la main",
    text: [
      {
        title: "DEUXIÈME CHANCE",
        description:
          "Lorsque ce personnage quitte la zone de jeu, vous pouvez choisir l'un de vos personnages et le renvoyer dans votre main.",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Mano Amica",
    text: [
      {
        title: "SECONDA OCCASIONE",
        description:
          "Quando questo personaggio lascia il gioco, puoi riprendere in mano un tuo personaggio a tua scelta.",
      },
    ],
  },
};
